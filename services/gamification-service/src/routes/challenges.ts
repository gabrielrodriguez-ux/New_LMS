/**
 * Challenge Routes
 * Weekly challenges and competitions
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const challengeRoutes = new Hono()

const createChallengeSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    type: z.enum(['weekly', 'bonus', 'special']).default('weekly'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    xpReward: z.number().min(1),
    criteria: z.object({
        type: z.enum(['complete_modules', 'earn_xp', 'complete_courses', 'perfect_quizzes']),
        target: z.number().min(1),
        courseIds: z.array(z.string().uuid()).optional()
    })
})

// GET /api/challenges (active challenges)
challengeRoutes.get('/', async (c) => {
    const tenantId = c.get('tenantId')
    const userId = c.get('userId')
    const { status } = c.req.query()

    const now = new Date()

    let where: any = { tenantId }

    if (status === 'active') {
        where.startDate = { lte: now }
        where.endDate = { gte: now }
    } else if (status === 'upcoming') {
        where.startDate = { gt: now }
    } else if (status === 'ended') {
        where.endDate = { lt: now }
    }

    const challenges = await prisma.challenge.findMany({
        where,
        orderBy: { startDate: 'desc' }
    })

    // Get user's participation status
    const participations = await prisma.challengeParticipant.findMany({
        where: {
            userId,
            challengeId: { in: challenges.map(c => c.id) }
        }
    })

    const participationMap = new Map(participations.map(p => [p.challengeId, p]))

    return c.json({
        data: challenges.map(challenge => ({
            id: challenge.id,
            name: challenge.name,
            description: challenge.description,
            type: challenge.type,
            startDate: challenge.startDate,
            endDate: challenge.endDate,
            xpReward: challenge.xpReward,
            criteria: challenge.criteria,
            participation: participationMap.get(challenge.id) ? {
                progress: participationMap.get(challenge.id)!.progress,
                completed: participationMap.get(challenge.id)!.completed
            } : null
        }))
    })
})

// POST /api/challenges
challengeRoutes.post('/', zValidator('json', createChallengeSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    const challenge = await prisma.challenge.create({
        data: {
            tenantId,
            name: body.name,
            description: body.description,
            type: body.type,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            xpReward: body.xpReward,
            criteria: body.criteria,
            status: 'upcoming'
        }
    })

    return c.json(challenge, 201)
})

// POST /api/challenges/:id/join
challengeRoutes.post('/:id/join', async (c) => {
    const tenantId = c.get('tenantId')
    const userId = c.get('userId')
    const { id } = c.req.param()

    const challenge = await prisma.challenge.findFirst({
        where: { id, tenantId }
    })

    if (!challenge) {
        return c.json({ error: 'Challenge not found' }, 404)
    }

    const now = new Date()
    if (now < challenge.startDate || now > challenge.endDate) {
        return c.json({ error: 'Challenge is not active' }, 400)
    }

    // Check if already joined
    const existing = await prisma.challengeParticipant.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } }
    })

    if (existing) {
        return c.json({ error: 'Already joined this challenge' }, 409)
    }

    await prisma.challengeParticipant.create({
        data: {
            userId,
            challengeId: id,
            tenantId,
            progress: 0
        }
    })

    return c.json({ success: true, message: 'Joined challenge' })
})

// POST /api/challenges/:id/complete
challengeRoutes.post('/:id/complete', async (c) => {
    const tenantId = c.get('tenantId')
    const userId = c.get('userId')
    const { id } = c.req.param()

    const participation = await prisma.challengeParticipant.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
        include: { challenge: true }
    })

    if (!participation) {
        return c.json({ error: 'Not participating in this challenge' }, 404)
    }

    if (participation.completed) {
        return c.json({ error: 'Challenge already completed' }, 409)
    }

    const criteria = participation.challenge.criteria as any

    if (participation.progress < criteria.target) {
        return c.json({
            error: 'Challenge criteria not met',
            progress: participation.progress,
            target: criteria.target
        }, 400)
    }

    // Mark as completed
    await prisma.challengeParticipant.update({
        where: { userId_challengeId: { userId, challengeId: id } },
        data: {
            completed: true,
            completedAt: new Date()
        }
    })

    // TODO: Award XP via gamification XP award endpoint
    // TODO: Publish Challenge.Completed event

    return c.json({
        success: true,
        xpReward: participation.challenge.xpReward,
        message: 'Challenge completed!'
    })
})

// PATCH /api/challenges/:id/progress (internal - update progress)
challengeRoutes.patch('/:id/progress', async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()
    const { userId, increment } = await c.req.json()

    const participation = await prisma.challengeParticipant.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } }
    })

    if (!participation || participation.completed) {
        return c.json({ error: 'Not participating or already completed' }, 400)
    }

    const updated = await prisma.challengeParticipant.update({
        where: { userId_challengeId: { userId, challengeId: id } },
        data: { progress: { increment } }
    })

    return c.json({ progress: updated.progress })
})

export { challengeRoutes }
