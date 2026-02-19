/**
 * Badge Routes
 * CRUD and award badges
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const badgeRoutes = new Hono()

const createBadgeSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    iconUrl: z.string().url().optional(),
    rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common'),
    criteria: z.object({
        type: z.enum(['courses_completed', 'xp_earned', 'streak', 'perfect_quiz', 'custom']),
        threshold: z.number().min(1),
        conditions: z.record(z.any()).optional()
    })
})

// GET /api/badges
badgeRoutes.get('/', async (c) => {
    const tenantId = c.get('tenantId')

    const badges = await prisma.badge.findMany({
        where: { tenantId, isActive: true },
        orderBy: { name: 'asc' }
    })

    return c.json({ data: badges })
})

// GET /api/badges/user (current user's earned badges)
badgeRoutes.get('/user', async (c) => {
    const userId = c.get('userId')
    const tenantId = c.get('tenantId')

    const userBadges = await prisma.userBadge.findMany({
        where: { userId, tenantId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' }
    })

    return c.json({
        data: userBadges.map(ub => ({
            id: ub.badge.id,
            name: ub.badge.name,
            description: ub.badge.description,
            iconUrl: ub.badge.iconUrl,
            rarity: ub.badge.rarity,
            earnedAt: ub.earnedAt,
            shared: ub.shared
        }))
    })
})

// POST /api/badges (create badge - admin)
badgeRoutes.post('/', zValidator('json', createBadgeSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    const badge = await prisma.badge.create({
        data: {
            tenantId,
            name: body.name,
            description: body.description,
            iconUrl: body.iconUrl,
            rarity: body.rarity,
            criteria: body.criteria
        }
    })

    return c.json(badge, 201)
})

// POST /api/badges/:id/award (award badge to user)
badgeRoutes.post('/:id/award', async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()
    const { userId } = await c.req.json()

    const badge = await prisma.badge.findFirst({
        where: { id, tenantId }
    })

    if (!badge) {
        return c.json({ error: 'Badge not found' }, 404)
    }

    // Check if already earned
    const existing = await prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId: id } }
    })

    if (existing) {
        return c.json({ error: 'Badge already earned' }, 409)
    }

    await prisma.userBadge.create({
        data: {
            userId,
            badgeId: id,
            tenantId
        }
    })

    // TODO: Publish Badge.Earned event

    return c.json({
        badgeId: id,
        badgeName: badge.name,
        userId,
        earnedAt: new Date()
    })
})

// POST /api/badges/:badgeId/share
badgeRoutes.post('/:badgeId/share', async (c) => {
    const userId = c.get('userId')
    const { badgeId } = c.req.param()

    await prisma.userBadge.update({
        where: { userId_badgeId: { userId, badgeId } },
        data: { shared: true }
    })

    // Return shareable URL/image
    return c.json({
        shareUrl: `https://app.thepower.education/badges/${badgeId}?user=${userId}`,
        message: 'Badge marked as shared'
    })
})

// Seed default badges
badgeRoutes.post('/seed', async (c) => {
    const tenantId = c.get('tenantId')

    const defaultBadges = [
        { name: 'Primer paso', description: 'Completa tu primer módulo', rarity: 'common', criteria: { type: 'courses_completed', threshold: 1 } },
        { name: 'Estudiante dedicado', description: 'Completa 5 cursos', rarity: 'uncommon', criteria: { type: 'courses_completed', threshold: 5 } },
        { name: 'Maestro del conocimiento', description: 'Completa 25 cursos', rarity: 'rare', criteria: { type: 'courses_completed', threshold: 25 } },
        { name: 'Experto legendario', description: 'Completa 50 cursos', rarity: 'epic', criteria: { type: 'courses_completed', threshold: 50 } },
        { name: 'Quiz perfecto', description: 'Obtén 100% en un quiz', rarity: 'uncommon', criteria: { type: 'perfect_quiz', threshold: 1 } },
        { name: 'Racha de 7 días', description: 'Aprende 7 días seguidos', rarity: 'uncommon', criteria: { type: 'streak', threshold: 7 } },
        { name: 'Racha de 30 días', description: 'Aprende 30 días seguidos', rarity: 'rare', criteria: { type: 'streak', threshold: 30 } },
        { name: 'Racha de 100 días', description: 'Aprende 100 días seguidos', rarity: 'legendary', criteria: { type: 'streak', threshold: 100 } },
        { name: 'Acumulador XP', description: 'Gana 10,000 XP', rarity: 'rare', criteria: { type: 'xp_earned', threshold: 10000 } },
        { name: 'XP Millonario', description: 'Gana 100,000 XP', rarity: 'legendary', criteria: { type: 'xp_earned', threshold: 100000 } }
    ]

    const created = []
    for (const badge of defaultBadges) {
        const exists = await prisma.badge.findUnique({
            where: { tenantId_name: { tenantId, name: badge.name } }
        })

        if (!exists) {
            await prisma.badge.create({
                data: { tenantId, ...badge }
            })
            created.push(badge.name)
        }
    }

    return c.json({ message: 'Badges seeded', created })
})

export { badgeRoutes }
