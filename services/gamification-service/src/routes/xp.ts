/**
 * XP Routes
 * Award XP, get profile, transaction history
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { calculateLevel, LEVEL_THRESHOLDS } from '../lib/levels'

const xpRoutes = new Hono()

const awardXpSchema = z.object({
    userId: z.string().uuid(),
    amount: z.number().min(1).max(10000),
    source: z.enum(['module_complete', 'course_complete', 'quiz_pass', 'challenge', 'streak', 'bonus']),
    sourceId: z.string().optional(),
    multiplier: z.number().min(0.1).max(5).default(1)
})

// GET /api/gamification/profile (current user)
xpRoutes.get('/profile', async (c) => {
    const userId = c.get('userId')
    const tenantId = c.get('tenantId')

    let userXp = await prisma.userXp.findUnique({
        where: { userId }
    })

    if (!userXp) {
        // Create initial XP record
        userXp = await prisma.userXp.create({
            data: { userId, tenantId, totalXp: 0, currentLevel: 1 }
        })
    }

    const levelInfo = calculateLevel(userXp.totalXp)

    // Get recent badges
    const recentBadges = await prisma.userBadge.findMany({
        where: { userId, tenantId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
        take: 5
    })

    // Get recent XP transactions
    const recentXp = await prisma.xpTransaction.findMany({
        where: { userId, tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10
    })

    return c.json({
        userId,
        totalXp: userXp.totalXp,
        currentLevel: levelInfo.level,
        levelName: levelInfo.name,
        xpToNextLevel: levelInfo.xpToNext,
        progressPercent: levelInfo.progressPercent,
        badges: recentBadges.map(ub => ({
            id: ub.badge.id,
            name: ub.badge.name,
            iconUrl: ub.badge.iconUrl,
            rarity: ub.badge.rarity,
            earnedAt: ub.earnedAt
        })),
        recentXpTransactions: recentXp.map(tx => ({
            amount: tx.amount,
            source: tx.source,
            createdAt: tx.createdAt
        }))
    })
})

// GET /api/gamification/profile/:userId
xpRoutes.get('/profile/:userId', async (c) => {
    const tenantId = c.get('tenantId')
    const { userId } = c.req.param()

    const userXp = await prisma.userXp.findFirst({
        where: { userId, tenantId }
    })

    if (!userXp) {
        return c.json({ error: 'User not found' }, 404)
    }

    const levelInfo = calculateLevel(userXp.totalXp)

    const badges = await prisma.userBadge.findMany({
        where: { userId, tenantId },
        include: { badge: true }
    })

    return c.json({
        userId,
        totalXp: userXp.totalXp,
        currentLevel: levelInfo.level,
        levelName: levelInfo.name,
        badges: badges.map(ub => ({
            id: ub.badge.id,
            name: ub.badge.name,
            iconUrl: ub.badge.iconUrl,
            rarity: ub.badge.rarity
        }))
    })
})

// POST /api/gamification/xp/award (internal use)
xpRoutes.post('/xp/award', zValidator('json', awardXpSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    const finalAmount = Math.round(body.amount * body.multiplier)

    // Record transaction
    await prisma.xpTransaction.create({
        data: {
            userId: body.userId,
            tenantId,
            amount: finalAmount,
            source: body.source,
            sourceId: body.sourceId,
            multiplier: body.multiplier
        }
    })

    // Update user XP
    const userXp = await prisma.userXp.upsert({
        where: { userId: body.userId },
        create: {
            userId: body.userId,
            tenantId,
            totalXp: finalAmount,
            currentLevel: 1
        },
        update: {
            totalXp: { increment: finalAmount }
        }
    })

    // Check for level up
    const newLevel = calculateLevel(userXp.totalXp)
    let leveledUp = false

    if (newLevel.level > userXp.currentLevel) {
        await prisma.userXp.update({
            where: { userId: body.userId },
            data: { currentLevel: newLevel.level }
        })
        leveledUp = true
        // TODO: Publish Level.Up event
    }

    // TODO: Publish XP.Awarded event

    return c.json({
        userId: body.userId,
        xpAwarded: finalAmount,
        totalXp: userXp.totalXp + finalAmount,
        currentLevel: newLevel.level,
        leveledUp
    })
})

// GET /api/gamification/history
xpRoutes.get('/history', async (c) => {
    const userId = c.get('userId')
    const tenantId = c.get('tenantId')
    const { cursor, pageSize } = c.req.query()

    const limit = Math.min(parseInt(pageSize || '20'), 100)

    const transactions = await prisma.xpTransaction.findMany({
        where: { userId, tenantId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' }
    })

    const hasMore = transactions.length > limit
    const data = hasMore ? transactions.slice(0, -1) : transactions

    return c.json({
        data,
        nextCursor: hasMore ? data[data.length - 1]?.id : undefined
    })
})

export { xpRoutes }
