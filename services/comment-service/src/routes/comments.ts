import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '../lib/prisma'

export const commentRoutes = new Hono()

const commentSchema = z.object({
    courseId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string().min(1),
    parentId: z.string().uuid().optional(),
})

// GET /api/comments?courseId=... - Get comments for a course
commentRoutes.get('/', async (c) => {
    const courseId = c.req.query('courseId')
    if (!courseId) return c.json({ error: 'courseId is required' }, 400)

    const comments = await prisma.comment.findMany({
        where: { courseId },
        orderBy: { createdAt: 'asc' }
    })

    return c.json(comments)
})

// POST /api/comments - Post a comment
commentRoutes.post('/', zValidator('json', commentSchema), async (c) => {
    const data = c.req.valid('json')

    const comment = await prisma.comment.create({
        data: {
            courseId: data.courseId,
            userId: data.userId,
            content: data.content,
            parentId: data.parentId
        }
    })

    return c.json(comment, 201)
})

// DELETE /api/comments/:id
commentRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id')
    // In real app, we would verify the user owns the comment
    try {
        await prisma.comment.delete({ where: { id } })
        return c.json({ message: 'Deleted' })
    } catch (error) {
        return c.json({ error: 'Not found' }, 404)
    }
})
