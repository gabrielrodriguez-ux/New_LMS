/**
 * Gamification Service - Main Entry Point
 * XP, badges, leaderboards, challenges
 */

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { xpRoutes } from './routes/xp'
import { badgeRoutes } from './routes/badges'
import { leaderboardRoutes } from './routes/leaderboards'
import { challengeRoutes } from './routes/challenges'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', errorHandler)

app.get('/health', (c) => c.json({ status: 'ok', service: 'gamification-service' }))

app.use('/api/*', authMiddleware)
app.route('/api/gamification', xpRoutes)
app.route('/api/badges', badgeRoutes)
app.route('/api/leaderboards', leaderboardRoutes)
app.route('/api/challenges', challengeRoutes)

const port = parseInt(process.env.PORT || '3008')

console.log(`🎮 Gamification Service starting on port ${port}`)

serve({ fetch: app.fetch, port })

export default app
