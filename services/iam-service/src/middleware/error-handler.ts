import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = createMiddleware(async (c, next) => {
    try {
        await next()
    } catch (error) {
        console.error('Request error:', error)

        if (error instanceof HTTPException) {
            return c.json({ error: error.message, status: error.status }, error.status)
        }

        const message = process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : (error as Error).message

        return c.json({ error: message, status: 500 }, 500)
    }
})
