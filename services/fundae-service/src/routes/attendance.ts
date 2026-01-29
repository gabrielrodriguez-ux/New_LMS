/**
 * Attendance Routes
 * Track and validate attendance for FUNDAE
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const attendanceRoutes = new Hono()

const recordSchema = z.object({
    userId: z.string().uuid(),
    courseId: z.string().uuid(),
    expedientId: z.string().uuid().optional(),
    hours: z.number().min(0.1),
    method: z.enum(['platform_access', 'qr', 'biometric']).default('platform_access'),
    totalRequiredHours: z.number().optional() // Passed from frontend/client context or looked up
})

// POST /api/fundae/attendance/record
attendanceRoutes.post('/record', zValidator('json', recordSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const { userId, courseId, expedientId, hours, method, totalRequiredHours } = c.req.valid('json')

    // Find or create the main attendance record
    let attendance = await prisma.fundaeAttendance.findUnique({
        where: { tenantId_userId_courseId: { tenantId, userId, courseId } }
    })

    if (!attendance) {
        if (!totalRequiredHours) return c.json({ error: 'Total required hours needed for new record' }, 400)

        attendance = await prisma.fundaeAttendance.create({
            data: {
                tenantId,
                userId,
                courseId,
                expedientId,
                totalRequiredHours: totalRequiredHours,
                attendedHours: 0,
                attendancePercentage: 0
            }
        })
    }

    // Add detail record
    await prisma.attendanceRecord.create({
        data: {
            attendanceId: attendance.id,
            hours,
            method,
            timestamp: new Date()
        }
    })

    // Recalculate totals
    const newAttended = Number(attendance.attendedHours) + hours
    const newPct = (newAttended / Number(attendance.totalRequiredHours)) * 100

    const updated = await prisma.fundaeAttendance.update({
        where: { id: attendance.id },
        data: {
            attendedHours: newAttended,
            attendancePercentage: newPct,
            meetsThreshold: newPct >= 75
        }
    })

    // If newly failing or passing threshold, could trigger event here
    if (!updated.meetsThreshold) {
        // TODO: Emit Attendance.BelowThreshold event
    }

    return c.json(updated)
})

// GET /api/fundae/attendance/:courseId/:userId
attendanceRoutes.get('/:courseId/:userId', async (c) => {
    const tenantId = c.get('tenantId')
    const { courseId, userId } = c.req.param()

    const record = await prisma.fundaeAttendance.findUnique({
        where: { tenantId_userId_courseId: { tenantId, userId, courseId } },
        include: { records: { orderBy: { timestamp: 'desc' }, take: 20 } }
    })

    if (!record) return c.json({ error: 'No attendance record found' }, 404)

    return c.json(record)
})

export { attendanceRoutes }
