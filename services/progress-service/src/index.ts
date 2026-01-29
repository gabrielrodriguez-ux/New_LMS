import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middleware/auth'
import { progressRoutes } from './routes/progress'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', authMiddleware)

app.get('/health', (c) => c.json({ status: 'ok', service: 'progress-service' }))

app.route('/api/progress', progressRoutes)

const port = parseInt(process.env.PORT || '3005')
console.log(`📈 Progress Service starting on port ${port}`)

serve({ fetch: app.fetch, port })
export default app
