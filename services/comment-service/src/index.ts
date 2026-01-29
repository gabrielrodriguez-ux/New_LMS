import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { commentRoutes } from './routes/comments'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/health', (c) => c.json({ status: 'ok', service: 'comment-service' }))

app.route('/api/comments', commentRoutes)

const port = parseInt(process.env.PORT || '3006')
console.log(`💬 Comment Service starting on port ${port}`)

serve({ fetch: app.fetch, port })
export default app
