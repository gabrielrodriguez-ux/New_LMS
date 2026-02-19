import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        // Fallback for development if no token is provided
        if (process.env.NODE_ENV !== 'production') {
            c.set('userId', '00000000-0000-0000-0000-000000000000')
            c.set('tenantId', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') // Set fallback tenant
            c.set('roles', [])
            try {
                return await next()
            } catch (e: any) {
                console.error("AuthMiddleware Dev Bypass Error:", e)
                return c.json({ error: e.message, stack: e.stack, source: 'auth-middleware' }, 500)
            }
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

        try {
            await next()
        } catch (e: any) {
            console.error("AuthMiddleware Next() Error:", e)
            return c.json({ error: e.message, stack: e.stack, source: 'auth-middleware-next' }, 500)
        }
    } catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
})
