import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middleware/auth'
import { enrollmentRoutes } from './routes/enrollments'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', authMiddleware)

app.get('/health', (c) => c.json({ status: 'ok', service: 'enrollment-service' }))

app.route('/api/enrollments', enrollmentRoutes)

const port = parseInt(process.env.PORT || '3004')
console.log(`🎓 Enrollment Service starting on port ${port}`)

serve({ fetch: app.fetch, port })
export default app
