import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        // Fallback for development if no token is provided
        if (process.env.NODE_ENV !== 'production') {
            c.set('userId', '00000000-0000-0000-0000-000000000000')
            c.set('tenantId' as any, '00000000-0000-0000-0000-000000000001')
            c.set('roles', [])
            return await next()
        }
        return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
        const { payload } = await jose.jwtVerify(
            authHeader.substring(7),
            new TextEncoder().encode(JWT_SECRET)
        )
        c.set('userId', payload.sub as string)
        c.set('tenantId' as any, payload.tenant_id as string)
        c.set('roles', payload.roles as string[] || [])
        await next()
    } catch (e) {
        return c.json({ error: 'Invalid token' }, 401)
    }
})
