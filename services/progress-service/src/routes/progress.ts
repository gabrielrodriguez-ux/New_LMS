import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '../lib/prisma'

export const progressRoutes = new Hono()

const updateProgressSchema = z.object({
    userId: z.string().uuid(),
    courseId: z.string().uuid(),
    moduleId: z.string().uuid(),
    status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
    timeSpentSeconds: z.number().min(0).optional(),
    score: z.number().min(0).max(100).optional(),
})

// GET /api/progress - List progress records
progressRoutes.get('/', async (c) => {
    const userId = c.req.query('userId')
    const courseId = c.req.query('courseId')
    const moduleId = c.req.query('moduleId')
    const tenantId = c.get('tenantId' as any)

    const records = await prisma.progress.findMany({
        where: {
            tenantId,
            ...(userId && { userId }),
            ...(courseId && { courseId }),
            ...(moduleId && { moduleId })
        }
    })

    return c.json(records)
})

// POST /api/progress - Update or create progress
progressRoutes.post('/', zValidator('json', updateProgressSchema), async (c) => {
    const data = c.req.valid('json')
    const tenantId = c.get('tenantId' as any)

    const progress = await prisma.progress.upsert({
        where: {
            tenantId_userId_moduleId: {
                tenantId,
                userId: data.userId,
                moduleId: data.moduleId
            }
        },
        update: {
            ...(data.status && { status: data.status }),
            ...(data.timeSpentSeconds !== undefined && { timeSpentSeconds: { increment: data.timeSpentSeconds } }),
            ...(data.score !== undefined && { score: data.score as any }),
            ...(data.status === 'completed' && { completedAt: new Date() })
        },
        create: {
            tenantId,
            userId: data.userId,
            courseId: data.courseId,
            moduleId: data.moduleId,
            status: data.status || 'in_progress',
            timeSpentSeconds: data.timeSpentSeconds || 0,
            score: data.score as any,
            ...(data.status === 'completed' && { completedAt: new Date() })
        }
    })

    return c.json(progress)
})

// GET /api/progress/course/:courseId/summary - Get course progress summary for a user
progressRoutes.get('/course/:courseId/summary', async (c) => {
    const courseId = c.req.param('courseId')
    const userId = c.req.query('userId')
    const tenantId = c.get('tenantId' as any)

    if (!userId) return c.json({ error: 'userId is required' }, 400)

    const records = await prisma.progress.findMany({
        where: { tenantId, userId, courseId }
    })

    const totalModules = records.length // This should ideally come from catalog-service
    const completedModules = records.filter(r => r.status === 'completed').length
    const progressPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

    return c.json({
        courseId,
        userId,
        progressPct,
        completedModules,
        totalModulesTracked: totalModules
    })
})
