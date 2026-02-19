/**
 * Leaderboard Routes
 * Real-time rankings with multiple scopes
 */

import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const leaderboardRoutes = new Hono()

// GET /api/leaderboards
leaderboardRoutes.get('/', async (c) => {
    const tenantId = c.get('tenantId')
    const userId = c.get('userId')
    const { scope, period, pageSize } = c.req.query()

    const limit = Math.min(parseInt(pageSize || '20'), 100)

    // Default to global scope
    const leaderboardScope = scope || 'global'

    // Build query based on scope
    let userXpData: any[]

    if (leaderboardScope === 'global') {
        userXpData = await prisma.userXp.findMany({
            where: { tenantId },
            orderBy: { totalXp: 'desc' },
            take: limit
        })
    } else {
        // For other scopes (department, team), would need to join with user data
        // Simplified for now to global
        userXpData = await prisma.userXp.findMany({
            where: { tenantId },
            orderBy: { totalXp: 'desc' },
            take: limit
        })
    }

    // Add rank numbers
    const leaderboard = userXpData.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        xp: entry.totalXp,
        level: entry.currentLevel,
        isCurrentUser: entry.userId === userId
    }))

    // Find current user's position if not in top
    let currentUserRank = null
    const isInTop = leaderboard.some(e => e.isCurrentUser)

    if (!isInTop) {
        const userXp = await prisma.userXp.findUnique({
            where: { userId }
        })

        if (userXp) {
            const rank = await prisma.userXp.count({
                where: {
                    tenantId,
                    totalXp: { gt: userXp.totalXp }
                }
            })

            currentUserRank = {
                rank: rank + 1,
                userId: userId,
                xp: userXp.totalXp,
                level: userXp.currentLevel,
                isCurrentUser: true
            }
        }
    }

    return c.json({
        scope: leaderboardScope,
        data: leaderboard,
        currentUserRank,
        updatedAt: new Date().toISOString()
    })
})

// GET /api/leaderboards/challenge/:challengeId
leaderboardRoutes.get('/challenge/:challengeId', async (c) => {
    const tenantId = c.get('tenantId')
    const userId = c.get('userId')
    const { challengeId } = c.req.param()
    const { pageSize } = c.req.query()

    const limit = Math.min(parseInt(pageSize || '20'), 100)

    const participants = await prisma.challengeParticipant.findMany({
        where: { challengeId, tenantId },
        orderBy: { progress: 'desc' },
        take: limit
    })

    const leaderboard = participants.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        progress: entry.progress,
        completed: entry.completed,
        isCurrentUser: entry.userId === userId
    }))

    return c.json({
        challengeId,
        data: leaderboard
    })
})

export { leaderboardRoutes }
