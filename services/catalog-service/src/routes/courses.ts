/**
 * Course Routes
 * CRUD, publish, versioning
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createClient } from '@supabase/supabase-js'

const courseRoutes = new Hono()

const createCourseSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    shortDescription: z.string().max(500).optional(),
    hours: z.number().min(0).max(1000),
    level: z.enum(['basico', 'intermedio', 'avanzado']).default('basico'),
    familyProfessional: z.string().optional(),
    fundaeCompatible: z.boolean().default(false),
    tags: z.array(z.string()).default([])
})

const updateCourseSchema = createCourseSchema.partial()

// GET /api/courses
courseRoutes.get('/', async (c) => {
    // const tenantId = c.get('tenantId') // Global catalog, ignoring tenantId
    const { status, level, fundae, cursor, pageSize } = c.req.query()

    try {
        const where: any = {}
        if (status) where.status = status
        if (level) where.level = level
        if (fundae === 'true') where.fundaeCompatible = true

        const courses = await prisma.course.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                modules: {
                    select: {
                        id: true,
                        title: true,
                        orderIndex: true
                    }
                }
            }
        })

        return c.json({
            data: courses.map((course: any) => ({
                id: course.id,
                title: course.title,
                // description: course.description,
                shortDescription: course.shortDescription || course.description?.substring(0, 100),
                thumbnailUrl: course.thumbnailUrl,
                hours: Number(course.hours),
                level: course.level,
                status: course.status,
                version: course.version,
                fundaeCompatible: course.fundaeCompatible,
                promotion: course.promotion,
                modulesCount: course.modules?.length || 0,
                tags: course.tags || []
            })),
            nextCursor: undefined
        })
    } catch (e: any) {
        console.error("Prisma Error:", e)
        return c.json({ error: e.message }, 500)
    }
})

// GET /api/courses/:id
courseRoutes.get('/:id', async (c) => {
    const { id } = c.req.param()

    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    select: {
                        id: true,
                        title: true,
                        orderIndex: true
                    },
                    orderBy: {
                        orderIndex: 'asc'
                    }
                }
            }
        })

        if (!course) {
            return c.json({ error: 'Course not found' }, 404)
        }

        return c.json({
            id: course.id,
            title: course.title,
            shortDescription: course.shortDescription || course.description?.substring(0, 100),
            thumbnailUrl: course.thumbnailUrl,
            hours: course.hours,
            level: course.level,
            status: course.status,
            version: course.version,
            fundaeCompatible: course.fundaeCompatible,
            promotion: false, // Default since schema doesn't match
            modulesCount: course.modules.length,
            tags: course.tags,
            modules: course.modules.map(m => ({
                id: m.id,
                title: m.title,
                order_index: m.orderIndex // Maquillaje para el frontend que espera snake_case si venía de supabase
            }))
        })
    } catch (e: any) {
        console.error("Prisma Error:", e)
        return c.json({ error: e.message }, 500)
    }
})


// POST /api/courses
courseRoutes.post('/', async (c) => {
    const body = await c.req.json()

    try {
        const course = await prisma.course.create({
            data: {
                title: body.title,
                description: body.description,
                status: body.status || 'draft',
                tenantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Hardcoded for prototype
                hours: Number(body.hours) || 0,
                level: body.level || 'basico',
                promotion: body.promotion, // Added
                familyProfessional: body.family_professional || body.familyProfessional // Handle both cases
            }
        })
        return c.json(course, 201)
    } catch (error: any) {
        console.error("Create Course Error:", error)
        return c.json({ error: error.message }, 500)
    }
})

// PUT /api/courses/:id
courseRoutes.put('/:id', async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()

    try {
        const course = await prisma.course.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                shortDescription: body.shortDescription,
                hours: body.hours,
                level: body.level,
                status: body.status,
                fundaeCompatible: body.fundaeCompatible,
                tags: body.tags
            }
        })
        return c.json(course)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

// GET /api/courses/:id/structure - Full Hierarchy
courseRoutes.get('/:id/structure', async (c) => {
    const { id } = c.req.param()

    try {
        // Fetch Modules -> Units -> Contents
        const modules = await prisma.module.findMany({
            where: { courseId: id },
            orderBy: { orderIndex: 'asc' },
            include: {
                units: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        contents: {
                            orderBy: { orderIndex: 'asc' }
                        }
                    }
                }
            }
        })

        return c.json({ modules })
    } catch (e: any) {
        console.error("[Structure] Prisma Error:", e);
        return c.json({ error: e.message }, 500)
    }
})

// POST /api/courses/:id/modules - Create Module (Level 1)
courseRoutes.post('/:id/modules', async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json() // { title, description }

    try {
        const module = await prisma.module.create({
            data: {
                courseId: id,
                title: body.title,
                description: body.description,
                orderIndex: body.orderIndex || 0,
                type: 'generic' // Default type
            }
        })
        return c.json(module, 201)
    } catch (error: any) {
        return c.json({ error: error.message }, 500)
    }
})

// POST /api/courses/modules/:id/units - Create Unit (Level 2)
courseRoutes.post('/modules/:id/units', async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()

    try {
        const unit = await prisma.unit.create({
            data: {
                moduleId: id,
                title: body.title,
                orderIndex: body.orderIndex || 0
            }
        })
        return c.json(unit, 201)
    } catch (error: any) {
        return c.json({ error: error.message }, 500)
    }
})

// POST /api/courses/units/:id/contents - Create Content (Level 3)
courseRoutes.post('/units/:id/contents', async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()

    try {
        const content = await prisma.content.create({
            data: {
                unitId: id,
                title: body.title,
                type: body.type, // video, quiz, etc
                contentUrl: body.contentUrl,
                body: body.body,
                isAiGenerated: body.isAiGenerated || false,
                orderIndex: body.orderIndex || 0
            }
        })
        return c.json(content, 201)
    } catch (error: any) {
        return c.json({ error: error.message }, 500)
    }
})

// GET /api/courses/:id/versions
courseRoutes.get('/:id/versions', async (c) => {
    return c.json({ data: [] })
})


// PUT /api/courses/contents/:id - Update Content (Move, Rename, Reorder)
courseRoutes.put('/contents/:id', async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()

    try {
        const updateData: any = {}
        if (body.title) updateData.title = body.title
        if (body.unitId) updateData.unitId = body.unitId
        if (body.orderIndex !== undefined) updateData.orderIndex = body.orderIndex
        if (body.type) updateData.type = body.type
        if (body.isAiGenerated !== undefined) updateData.isAiGenerated = body.isAiGenerated
        if (body.contentUrl !== undefined) updateData.contentUrl = body.contentUrl
        if (body.body !== undefined) updateData.body = body.body

        const content = await prisma.content.update({
            where: { id },
            data: updateData
        })
        return c.json(content)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

// DELETE /api/courses/contents/:id - Remove Content
courseRoutes.delete('/contents/:id', async (c) => {
    const { id } = c.req.param()

    try {
        await prisma.content.delete({
            where: { id }
        })
        return c.json({ success: true })
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})


export { courseRoutes }
