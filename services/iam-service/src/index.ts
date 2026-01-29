/**
 * IAM Service - Main Entry Point
 * Users, roles, authentication for ThePower LMS
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { userRoutes } from './routes/users'
import { authRoutes } from './routes/auth'
import { roleRoutes } from './routes/roles'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

// Global middleware
app.use('*', cors())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', errorHandler)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'iam-service' }))

// Public routes (no auth required)
app.route('/api/auth', authRoutes)

// Protected routes
app.use('/api/*', authMiddleware)
app.route('/api/users', userRoutes)
app.route('/api/roles', roleRoutes)

const port = parseInt(process.env.PORT || '3002')

console.log(`👤 IAM Service starting on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

export default app
