/**
 * Authentication Middleware
 * JWT validation and tenant context extraction
 */

import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Missing or invalid authorization header' }, 401)
    }

    const token = authHeader.substring(7)

    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)

        // Set user and tenant context
        c.set('userId', payload.sub as string)
        c.set('tenantId', payload.tenant_id as string)
        c.set('roles', payload.roles as string[] || [])

        await next()
    } catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
})

/**
 * Require specific role middleware
 */
export function requireRole(...allowedRoles: string[]) {
    return createMiddleware(async (c, next) => {
        const roles = c.get('roles') as string[]

        const hasRole = allowedRoles.some(role => roles.includes(role))
        if (!hasRole) {
            return c.json({ error: 'Insufficient permissions' }, 403)
        }

        await next()
    })
}

/**
 * Platform admin only middleware
 */
export const platformAdminOnly = createMiddleware(async (c, next) => {
    const roles = c.get('roles') as string[]

    if (!roles.includes('platform_admin')) {
        return c.json({ error: 'Platform admin access required' }, 403)
    }

    await next()
})
