import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
export const errorHandler = createMiddleware(async (c, next) => {
    try { await next() } catch (e) {
        console.error('Error:', e)
        if (e instanceof HTTPException) return c.json({ error: e.message }, e.status)
        return c.json({ error: 'Internal server error' }, 500)
    }
})
