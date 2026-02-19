/**
 * Audit Log Utility
 * Records actions for compliance and debugging
 */

import type { Context } from 'hono'
import { prisma } from './prisma'

interface AuditLogParams {
    tenantId: string
    userId?: string
    action: string
    resource: string
    resourceId?: string
    before?: any
    after?: any
    context: Context
}

export async function auditLog(params: AuditLogParams): Promise<void> {
    const { tenantId, userId, action, resource, resourceId, before, after, context } = params

    try {
        await prisma.auditLog.create({
            data: {
                tenantId,
                userId,
                action,
                resource,
                resourceId,
                before: before ? JSON.parse(JSON.stringify(before)) : null,
                after: after ? JSON.parse(JSON.stringify(after)) : null,
                ipAddress: context.req.header('x-forwarded-for') ||
                    context.req.header('x-real-ip') ||
                    'unknown',
                userAgent: context.req.header('user-agent')
            }
        })
    } catch (error) {
        // Log but don't fail the request
        console.error('Failed to create audit log:', error)
    }
}
