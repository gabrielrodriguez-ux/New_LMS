/**
 * Auth Routes
 * Login, token refresh, SSO callback
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as jose from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

const authRoutes = new Hono()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = '24h'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    tenantSlug: z.string().optional()
})

const refreshSchema = z.object({
    refreshToken: z.string()
})

// POST /api/auth/login
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password, tenantSlug } = c.req.valid('json')

    // Find user by email (optionally scoped to tenant)
    const whereClause: any = { email, deletedAt: null }

    if (tenantSlug) {
        const tenant = await prisma.$queryRaw`
      SELECT id FROM tenants WHERE slug = ${tenantSlug} LIMIT 1
    ` as any[]

        if (tenant.length === 0) {
            return c.json({ error: 'Tenant not found' }, 404)
        }
        whereClause.tenantId = tenant[0].id
    }

    const user = await prisma.user.findFirst({
        where: whereClause,
        include: {
            userRoles: { include: { role: true } }
        }
    })

    if (!user || !user.passwordHash) {
        return c.json({ error: 'Invalid credentials' }, 401)
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
        return c.json({ error: 'Invalid credentials' }, 401)
    }

    if (user.status !== 'active') {
        return c.json({ error: 'Account is not active' }, 403)
    }

    // Generate tokens
    const secret = new TextEncoder().encode(JWT_SECRET)
    const roles = user.userRoles.map(ur => ur.role.name)

    const accessToken = await new jose.SignJWT({
        sub: user.id,
        tenant_id: user.tenantId,
        email: user.email,
        roles
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(secret)

    const refreshToken = await new jose.SignJWT({
        sub: user.id,
        type: 'refresh'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret)

    // Create session
    await prisma.session.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            deviceInfo: c.req.header('user-agent'),
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })

    // Update last login
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
    })

    return c.json({
        accessToken,
        refreshToken,
        expiresIn: 86400, // 24 hours
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles
        }
    })
})

// POST /api/auth/refresh
authRoutes.post('/refresh', zValidator('json', refreshSchema), async (c) => {
    const { refreshToken } = c.req.valid('json')

    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jose.jwtVerify(refreshToken, secret)

        if (payload.type !== 'refresh') {
            return c.json({ error: 'Invalid token type' }, 401)
        }

        const user = await prisma.user.findFirst({
            where: { id: payload.sub as string, deletedAt: null },
            include: { userRoles: { include: { role: true } } }
        })

        if (!user || user.status !== 'active') {
            return c.json({ error: 'User not found or inactive' }, 401)
        }

        const roles = user.userRoles.map(ur => ur.role.name)

        const accessToken = await new jose.SignJWT({
            sub: user.id,
            tenant_id: user.tenantId,
            email: user.email,
            roles
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(JWT_EXPIRES_IN)
            .sign(secret)

        return c.json({
            accessToken,
            expiresIn: 86400
        })
    } catch (error) {
        return c.json({ error: 'Invalid or expired refresh token' }, 401)
    }
})

// POST /api/auth/logout
authRoutes.post('/logout', async (c) => {
    const authHeader = c.req.header('Authorization')

    if (authHeader?.startsWith('Bearer ')) {
        try {
            const token = authHeader.substring(7)
            const secret = new TextEncoder().encode(JWT_SECRET)
            const { payload } = await jose.jwtVerify(token, secret)

            // Revoke all sessions for user
            await prisma.session.updateMany({
                where: {
                    userId: payload.sub as string,
                    revokedAt: null
                },
                data: { revokedAt: new Date() }
            })
        } catch (e) {
            // Token invalid, but logout anyway
        }
    }

    return c.json({ success: true })
})

// GET /api/auth/me
authRoutes.get('/me', async (c) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Not authenticated' }, 401)
    }

    try {
        const token = authHeader.substring(7)
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)

        const user = await prisma.user.findFirst({
            where: { id: payload.sub as string, deletedAt: null },
            include: { userRoles: { include: { role: true } } }
        })

        if (!user) {
            return c.json({ error: 'User not found' }, 404)
        }

        return c.json({
            id: user.id,
            tenantId: user.tenantId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            roles: user.userRoles.map(ur => ur.role.name),
            preferences: user.preferences
        })
    } catch (error) {
        return c.json({ error: 'Invalid token' }, 401)
    }
})

export { authRoutes }
