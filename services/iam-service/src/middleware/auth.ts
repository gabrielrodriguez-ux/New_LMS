import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        // Fallback for development if no token is provided
        if (process.env.NODE_ENV !== 'production') {
            c.set('userId', '00000000-0000-0000-0000-000000000000')
            // c.set('tenantId' as any, '690486dd-189c-4332-92a7-ec4897e04127') // Removed to allow SuperAdmin (All Tenants) view by default
            c.set('roles', [])
            return await next()
        }
        return c.json({ error: 'Missing or invalid authorization header' }, 401)
    }

    const token = authHeader.substring(7)

    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)

        c.set('userId', payload.sub as string)
        c.set('tenantId', payload.tenant_id as string)
        c.set('roles', payload.roles as string[] || [])

        await next()
    } catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
})
