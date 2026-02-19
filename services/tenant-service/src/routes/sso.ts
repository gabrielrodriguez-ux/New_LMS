/**
 * SSO Configuration Routes
 * SAML/OAuth2 setup per tenant
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { auditLog } from '../lib/audit'

const ssoRoutes = new Hono()

const ssoConfigSchema = z.object({
    provider: z.enum(['saml', 'oauth2', 'azure_ad', 'google', 'okta']),
    entityId: z.string().min(1),
    ssoUrl: z.string().url().optional(),
    certificate: z.string().optional(),
    autoProvisioning: z.boolean().default(true),
    attributeMapping: z.record(z.string()).default({})
})

// POST /api/sso/:tenantId/config
ssoRoutes.post(
    '/:tenantId/config',
    zValidator('json', ssoConfigSchema),
    async (c) => {
        const { tenantId } = c.req.param()
        const body = c.req.valid('json')
        const userId = c.get('userId')

        // Verify tenant exists
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        })

        if (!tenant) {
            return c.json({ error: 'Tenant not found' }, 404)
        }

        // Upsert SSO config
        const ssoConfig = await prisma.ssoConfig.upsert({
            where: {
                tenantId_provider: {
                    tenantId,
                    provider: body.provider
                }
            },
            create: {
                tenantId,
                provider: body.provider,
                entityId: body.entityId,
                ssoUrl: body.ssoUrl,
                certificate: body.certificate,
                autoProvisioning: body.autoProvisioning,
                attributeMapping: body.attributeMapping
            },
            update: {
                entityId: body.entityId,
                ssoUrl: body.ssoUrl,
                certificate: body.certificate,
                autoProvisioning: body.autoProvisioning,
                attributeMapping: body.attributeMapping,
                isActive: true
            }
        })

        // Audit log
        await auditLog({
            tenantId,
            userId,
            action: 'sso.config.updated',
            resource: 'sso_config',
            resourceId: ssoConfig.id,
            after: { provider: body.provider, entityId: body.entityId },
            context: c
        })

        return c.json({
            id: ssoConfig.id,
            provider: ssoConfig.provider,
            entityId: ssoConfig.entityId,
            autoProvisioning: ssoConfig.autoProvisioning,
            isActive: ssoConfig.isActive
        }, 201)
    }
)

// GET /api/sso/:tenantId/config
ssoRoutes.get('/:tenantId/config', async (c) => {
    const { tenantId } = c.req.param()

    const configs = await prisma.ssoConfig.findMany({
        where: { tenantId, isActive: true },
        select: {
            id: true,
            provider: true,
            entityId: true,
            ssoUrl: true,
            autoProvisioning: true,
            attributeMapping: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return c.json({ data: configs })
})

// DELETE /api/sso/:tenantId/config/:provider
ssoRoutes.delete('/:tenantId/config/:provider', async (c) => {
    const { tenantId, provider } = c.req.param()
    const userId = c.get('userId')

    const config = await prisma.ssoConfig.findUnique({
        where: {
            tenantId_provider: { tenantId, provider }
        }
    })

    if (!config) {
        return c.json({ error: 'SSO config not found' }, 404)
    }

    await prisma.ssoConfig.update({
        where: { id: config.id },
        data: { isActive: false }
    })

    // Audit log
    await auditLog({
        tenantId,
        userId,
        action: 'sso.config.disabled',
        resource: 'sso_config',
        resourceId: config.id,
        before: { provider, isActive: true },
        after: { provider, isActive: false },
        context: c
    })

    return c.json({ success: true })
})

export { ssoRoutes }
