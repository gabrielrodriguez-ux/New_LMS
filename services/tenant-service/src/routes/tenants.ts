/**
 * Tenant Routes
 * CRUD operations for tenants with multi-tenancy
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { auditLog } from '../lib/audit'

const tenantRoutes = new Hono()

// Validation schemas
const brandingSchema = z.object({
    logoUrl: z.string().url().optional(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#1e3740'),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#a1e6c5'),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#98d3b6'),
    fontFamily: z.string().default('Poppins')
})

const featureFlagsSchema = z.object({
    leaderboard: z.boolean().default(true),
    challenges: z.boolean().default(true),
    hrisSync: z.boolean().default(false),
    fundae: z.boolean().default(false),
    advancedExports: z.boolean().default(false),
    ltiIntegration: z.boolean().default(false),
    xapiTracking: z.boolean().default(true)
})

const gamificationConfigSchema = z.object({
    enabled: z.boolean().default(true),
    leaderboardScopes: z.array(z.enum(['global', 'department', 'team', 'course', 'challenge'])).default(['global']),
    optOutEnabled: z.boolean().default(true),
    xpRules: z.object({
        moduleComplete: z.number().default(50),
        courseComplete: z.number().default(500),
        quizPass: z.number().default(100),
        perfectQuiz: z.number().default(200),
        dailyStreak: z.number().default(25),
        weeklyChallenge: z.number().default(300)
    }).default({}),
    antiCheatEnabled: z.boolean().default(true),
    dailyXpLimit: z.number().optional()
})

const notificationConfigSchema = z.object({
    quietHoursStart: z.string().optional(),
    quietHoursEnd: z.string().optional(),
    weeklyNotificationCap: z.number().optional(),
    channels: z.array(z.enum(['email', 'slack', 'teams', 'push'])).default(['email'])
})

const createTenantSchema = z.object({
    name: z.string().min(2).max(255),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
    domain: z.string().optional(),
    cif: z.string().optional(),
    sector: z.string().optional(),
    branding: brandingSchema.optional(),
    featureFlags: featureFlagsSchema.optional(),
    gamificationConfig: gamificationConfigSchema.optional(),
    notificationConfig: notificationConfigSchema.optional()
})

const updateTenantSchema = createTenantSchema.partial()

// GET /api/tenants/:tenantId/settings
tenantRoutes.get('/:tenantId/settings', async (c) => {
    const { tenantId } = c.req.param()

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
    })

    if (!tenant) {
        return c.json({ error: 'Tenant not found' }, 404)
    }

    return c.json({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain,
        cif: tenant.cif,
        sector: tenant.sector,
        branding: tenant.branding,
        featureFlags: tenant.featureFlags,
        gamificationConfig: tenant.gamificationConfig,
        notificationConfig: tenant.notificationConfig,
        status: tenant.status,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt
    })
})

// PUT /api/tenants/:tenantId/settings
tenantRoutes.put(
    '/:tenantId/settings',
    zValidator('json', updateTenantSchema),
    async (c) => {
        const { tenantId } = c.req.param()
        const body = c.req.valid('json')
        const userId = c.get('userId')

        const existing = await prisma.tenant.findUnique({
            where: { id: tenantId }
        })

        if (!existing) {
            return c.json({ error: 'Tenant not found' }, 404)
        }

        const updated = await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                ...body,
                branding: body.branding ?? existing.branding,
                featureFlags: body.featureFlags ?? existing.featureFlags,
                gamificationConfig: body.gamificationConfig ?? existing.gamificationConfig,
                notificationConfig: body.notificationConfig ?? existing.notificationConfig
            }
        })

        // Audit log
        await auditLog({
            tenantId,
            userId,
            action: 'tenant.settings.updated',
            resource: 'tenant',
            resourceId: tenantId,
            before: existing,
            after: updated,
            context: c
        })

        return c.json(updated)
    }
)

// POST /api/tenants (Platform Admin only)
tenantRoutes.post(
    '/',
    zValidator('json', createTenantSchema),
    async (c) => {
        const body = c.req.valid('json')
        const userId = c.get('userId')

        // Check slug uniqueness
        const existingSlug = await prisma.tenant.findUnique({
            where: { slug: body.slug }
        })

        if (existingSlug) {
            return c.json({ error: 'Slug already exists' }, 409)
        }

        const tenant = await prisma.tenant.create({
            data: {
                name: body.name,
                slug: body.slug,
                domain: body.domain,
                cif: body.cif,
                sector: body.sector,
                branding: body.branding ?? {
                    primaryColor: '#1e3740',
                    secondaryColor: '#a1e6c5',
                    accentColor: '#98d3b6',
                    fontFamily: 'Poppins'
                },
                featureFlags: body.featureFlags ?? {
                    leaderboard: true,
                    challenges: true,
                    hrisSync: false,
                    fundae: false,
                    advancedExports: false,
                    ltiIntegration: false,
                    xapiTracking: true
                },
                gamificationConfig: body.gamificationConfig ?? {
                    enabled: true,
                    leaderboardScopes: ['global'],
                    optOutEnabled: true,
                    xpRules: {
                        moduleComplete: 50,
                        courseComplete: 500,
                        quizPass: 100,
                        perfectQuiz: 200,
                        dailyStreak: 25,
                        weeklyChallenge: 300
                    },
                    antiCheatEnabled: true
                },
                notificationConfig: body.notificationConfig ?? {
                    channels: ['email']
                }
            }
        })

        // Audit log
        await auditLog({
            tenantId: tenant.id,
            userId,
            action: 'tenant.created',
            resource: 'tenant',
            resourceId: tenant.id,
            after: tenant,
            context: c
        })

        // TODO: Publish Tenant.Created event

        return c.json(tenant, 201)
    }
)

// GET /api/tenants (Platform Admin - list all)
tenantRoutes.get('/', async (c) => {
    const tenants = await prisma.tenant.findMany({
        where: { status: 'active' },
        orderBy: { name: 'asc' }
    })

    return c.json({ data: tenants })
})

export { tenantRoutes }
