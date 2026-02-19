import { createMiddleware } from 'hono/factory'
export const errorHandler = createMiddleware(async (c, next) => {
    try { await next() } catch (e) {
        console.error('Error:', e)
        return c.json({ error: 'Internal server error' }, 500)
    }
})
