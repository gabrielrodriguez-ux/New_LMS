/**
 * Module Routes
 * CRUD for course modules
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const moduleRoutes = new Hono()

const createModuleSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    type: z.enum(['video', 'pdf', 'text', 'quiz', 'scorm', 'lti']),
    contentUrl: z.string().url().optional(),
    durationMinutes: z.number().min(0).default(0),
    orderIndex: z.number().min(0),
    isMandatory: z.boolean().default(true),
    xpReward: z.number().min(0).default(50),
    metadata: z.record(z.any()).optional()
})

const updateModuleSchema = createModuleSchema.partial()

const reorderSchema = z.object({
    moduleIds: z.array(z.string().uuid())
})

// POST /api/modules (with courseId in body)
moduleRoutes.post('/', zValidator('json', createModuleSchema.extend({
    courseId: z.string().uuid()
})), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    // Verify course belongs to tenant
    const course = await prisma.course.findFirst({
        where: { id: body.courseId, tenantId }
    })

    if (!course) {
        return c.json({ error: 'Course not found' }, 404)
    }

    if (course.status === 'published') {
        return c.json({ error: 'Cannot add modules to published course' }, 400)
    }

    const module = await prisma.module.create({
        data: {
            courseId: body.courseId,
            title: body.title,
            description: body.description,
            type: body.type,
            contentUrl: body.contentUrl,
            durationMinutes: body.durationMinutes,
            orderIndex: body.orderIndex,
            isMandatory: body.isMandatory,
            xpReward: body.xpReward,
            metadata: body.metadata || {}
        }
    })

    return c.json(module, 201)
})

// GET /api/modules/:id
moduleRoutes.get('/:id', async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()

    const module = await prisma.module.findFirst({
        where: { id },
        include: {
            course: { select: { id: true, tenantId: true, title: true } }
        }
    })

    if (!module || module.course.tenantId !== tenantId) {
        return c.json({ error: 'Module not found' }, 404)
    }

    return c.json(module)
})

// PUT /api/modules/:id
moduleRoutes.put('/:id', zValidator('json', updateModuleSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()
    const body = c.req.valid('json')

    const module = await prisma.module.findFirst({
        where: { id },
        include: { course: { select: { tenantId: true, status: true } } }
    })

    if (!module || module.course.tenantId !== tenantId) {
        return c.json({ error: 'Module not found' }, 404)
    }

    const updated = await prisma.module.update({
        where: { id },
        data: body
    })

    return c.json(updated)
})

// DELETE /api/modules/:id
moduleRoutes.delete('/:id', async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()

    const module = await prisma.module.findFirst({
        where: { id },
        include: { course: { select: { tenantId: true, status: true } } }
    })

    if (!module || module.course.tenantId !== tenantId) {
        return c.json({ error: 'Module not found' }, 404)
    }

    if (module.course.status === 'published') {
        return c.json({ error: 'Cannot delete module from published course' }, 400)
    }

    await prisma.module.delete({ where: { id } })

    return c.json({ success: true })
})

// POST /api/modules/reorder
moduleRoutes.post('/reorder', zValidator('json', reorderSchema.extend({
    courseId: z.string().uuid()
})), async (c) => {
    const tenantId = c.get('tenantId')
    const { courseId, moduleIds } = c.req.valid('json')

    const course = await prisma.course.findFirst({
        where: { id: courseId, tenantId }
    })

    if (!course) {
        return c.json({ error: 'Course not found' }, 404)
    }

    // Update order for each module
    await prisma.$transaction(
        moduleIds.map((moduleId, index) =>
            prisma.module.update({
                where: { id: moduleId },
                data: { orderIndex: index }
            })
        )
    )

    return c.json({ success: true })
})

export { moduleRoutes }
