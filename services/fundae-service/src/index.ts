/**
 * FUNDAE Service - Main Entry Point
 * Expedients, compliance validation, attendance tracking
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { expedientRoutes } from './routes/expedients'
import { attendanceRoutes } from './routes/attendance'
import { docenteRoutes } from './routes/docentes'
import { reportRoutes } from './routes/reports'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', errorHandler)

app.get('/health', (c) => c.json({ status: 'ok', service: 'fundae-service' }))

app.use('/api/*', authMiddleware)
app.route('/api/fundae/expedients', expedientRoutes)
app.route('/api/fundae/attendance', attendanceRoutes)
app.route('/api/fundae/docentes', docenteRoutes)
app.route('/api/fundae/reports', reportRoutes)

const port = parseInt(process.env.PORT || '3007')

console.log(`📋 FUNDAE Service starting on port ${port}`)

serve({ fetch: app.fetch, port })

export default app
