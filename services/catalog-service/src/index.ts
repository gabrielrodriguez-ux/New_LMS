/**
 * Catalog Service - Main Entry Point
 * Courses and content management
 */

import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { courseRoutes } from './routes/courses'
import { moduleRoutes } from './routes/modules'
import { aiRoutes } from './routes/ai'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', errorHandler)

app.get('/health', (c) => c.json({ status: 'ok', service: 'catalog-service' }))

app.use('/api/*', authMiddleware)
app.route('/api/courses', courseRoutes)
app.route('/api/modules', moduleRoutes)
app.route('/api/ai', aiRoutes)

const port = parseInt(process.env.PORT || '3003')

console.log(`📚 Catalog Service starting on port ${port}`)

serve({ fetch: app.fetch, port })

export default app
