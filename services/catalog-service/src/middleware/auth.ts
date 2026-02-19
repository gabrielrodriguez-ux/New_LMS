import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    // Dev fallback
    if (!authHeader) {
        c.set('userId', 'd027975b-b305-410c-907a-b3fc01b9dabe') // Demo user
        c.set('tenantId', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') // Client ID (ThePower Education)
        c.set('roles', ['admin'])
        await next()
        return
    }

    if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)
    try {
        const { payload } = await jose.jwtVerify(authHeader.substring(7), new TextEncoder().encode(JWT_SECRET))
        c.set('userId', payload.sub as string)
        c.set('tenantId', payload.tenant_id as string)
        c.set('roles', payload.roles as string[] || [])
        await next()
    } catch { return c.json({ error: 'Invalid token' }, 401) }
})
