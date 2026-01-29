/**
 * Tenant Service - Main Entry Point
 * Multi-tenancy core for ThePower LMS
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { prettyJSON } from 'hono/pretty-json'

import { tenantRoutes } from './routes/tenants'
import { ssoRoutes } from './routes/sso'
import { auditRoutes } from './routes/audit'
import { errorHandler } from './middleware/error-handler'
import { authMiddleware } from './middleware/auth'

const app = new Hono()

// Global middleware
app.use('*', cors())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', prettyJSON())
app.use('*', errorHandler)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'tenant-service' }))

// Protected routes
app.use('/api/*', authMiddleware)

// Mount routes
app.route('/api/tenants', tenantRoutes)
app.route('/api/sso', ssoRoutes)
app.route('/api/audit', auditRoutes)

const port = parseInt(process.env.PORT || '3001')

console.log(`🏢 Tenant Service starting on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

export default app
