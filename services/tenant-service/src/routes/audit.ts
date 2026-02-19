/**
 * Audit Log Routes
 * Query audit trail per tenant
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const auditRoutes = new Hono()

// GET /api/audit/logs
auditRoutes.get('/logs', async (c) => {
    const tenantId = c.get('tenantId')
    const { startDate, endDate, action, resource, userId, cursor, pageSize } = c.req.query()

    const limit = Math.min(parseInt(pageSize || '50'), 100)

    const where: any = { tenantId }

    if (startDate) {
        where.timestamp = { ...where.timestamp, gte: new Date(startDate) }
    }
    if (endDate) {
        where.timestamp = { ...where.timestamp, lte: new Date(endDate) }
    }
    if (action) {
        where.action = { contains: action }
    }
    if (resource) {
        where.resource = resource
    }
    if (userId) {
        where.userId = userId
    }

    const logs = await prisma.auditLog.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { timestamp: 'desc' },
        select: {
            id: true,
            userId: true,
            action: true,
            resource: true,
            resourceId: true,
            before: true,
            after: true,
            ipAddress: true,
            timestamp: true
        }
    })

    const hasMore = logs.length > limit
    const data = hasMore ? logs.slice(0, -1) : logs
    const nextCursor = hasMore ? logs[logs.length - 2]?.id : undefined

    return c.json({
        data,
        nextCursor,
        hasMore
    })
})

// GET /api/audit/logs/:id
auditRoutes.get('/logs/:id', async (c) => {
    const { id } = c.req.param()
    const tenantId = c.get('tenantId')

    const log = await prisma.auditLog.findFirst({
        where: { id, tenantId }
    })

    if (!log) {
        return c.json({ error: 'Audit log not found' }, 404)
    }

    return c.json(log)
})

export { auditRoutes }
