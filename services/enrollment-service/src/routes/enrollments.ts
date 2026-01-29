import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '../lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const enrollmentRoutes = new Hono()

// Validation Schemas
const createEnrollmentSchema = z.object({
    userId: z.string().uuid(),
    courseId: z.string().uuid(),
    cohortId: z.string().uuid().optional(),
    deadline: z.string().datetime().optional(),
})

const updateEnrollmentSchema = z.object({
    status: z.enum(['assigned', 'in_progress', 'completed', 'expired']).optional(),
    progress: z.number().min(0).max(100).optional(),
    completedAt: z.string().datetime().optional(),
})

// GET /api/enrollments - List enrollments
enrollmentRoutes.get('/', async (c) => {
    const userId = c.req.query('userId')
    const courseId = c.req.query('courseId')
    // const tenantId = c.get('tenantId' as any) // Removed as not in DB

    const sbUrl = process.env.SUPABASE_URL || ''
    const sbKey = process.env.SUPABASE_ANON_KEY || ''
    const supabase = createClient(sbUrl, sbKey)

    let query = supabase
        .from('enrollments')
        .select('*')

    // if (tenantId) query = query.eq('tenant_id', tenantId) // DB has no tenant_id
    if (userId) query = query.eq('user_id', userId)
    if (courseId) query = query.eq('course_id', courseId)

    query = query.order('assigned_at', { ascending: false })

    const { data: enrollments, error } = await query

    if (error) {
        return c.json({ error: error.message }, 500)
    }

    return c.json(enrollments.map((e: any) => ({
        id: e.id,
        userId: e.user_id,
        courseId: e.course_id,
        status: e.status,
        progress: e.progress_pct, // Map progress_pct to progress
        assignedAt: e.assigned_at,
        subscriptionId: e.subscription_id
    })))
})

// POST /api/enrollments - Enroll user in course
enrollmentRoutes.post('/', zValidator('json', createEnrollmentSchema), async (c) => {
    const data = c.req.valid('json')
    // const tenantId = c.get('tenantId' as any)

    const sbUrl = process.env.SUPABASE_URL || ''
    const sbKey = process.env.SUPABASE_ANON_KEY || ''
    const supabase = createClient(sbUrl, sbKey)

    // Check if exists
    const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', data.userId)
        .eq('course_id', data.courseId)
        .single()

    if (existing) {
        return c.json({ error: 'User is already enrolled in this course' }, 409)
    }

    const { data: enrollment, error } = await supabase
        .from('enrollments')
        .insert({
            user_id: data.userId,
            course_id: data.courseId,
            cohort_id: data.cohortId || null,
            status: 'assigned',
            progress_pct: 0,
            assigned_at: new Date().toISOString()
            // subscription_id: null // DB allows null
        })
        .select()
        .single()

    if (error || !enrollment) {
        console.error("Enrollment create error:", error)
        return c.json({ error: 'Failed to create enrollment' }, 500)
    }

    return c.json({
        id: enrollment.id,
        userId: enrollment.user_id,
        courseId: enrollment.course_id,
        status: enrollment.status,
        progress: enrollment.progress_pct,
        assignedAt: enrollment.assigned_at
    }, 201)
})

// GET /api/enrollments/:id - Get enrollment details
enrollmentRoutes.get('/:id', async (c) => {
    const id = c.req.param('id')
    return c.json({ error: "Not implemented" }, 501)
})

// PATCH /api/enrollments/:id - Update enrollment
enrollmentRoutes.patch('/:id', async (c) => {
    return c.json({ error: "Update disabled (DB Connection Issue)" }, 503)
})

// DELETE /api/enrollments/:id - Unenroll
enrollmentRoutes.delete('/:id', async (c) => {
    return c.json({ error: "Delete disabled (DB Connection Issue)" }, 503)
})
