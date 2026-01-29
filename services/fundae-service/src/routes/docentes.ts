/**
 * Docente Routes
 * Manage qualified teachers/trainers
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const docenteRoutes = new Hono()

const createDocenteSchema = z.object({
    userId: z.string().uuid(),
    specialties: z.array(z.string()),
    certifications: z.array(z.object({
        name: z.string(),
        issuedBy: z.string(),
        issuedAt: z.string().datetime(),
        expiresAt: z.string().datetime().optional()
    }))
})

// POST /api/fundae/docentes
docenteRoutes.post('/', zValidator('json', createDocenteSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    const docente = await prisma.docente.create({
        data: {
            tenantId,
            userId: body.userId,
            specialties: body.specialties,
            certifications: body.certifications
        }
    })

    return c.json(docente, 201)
})

// GET /api/fundae/docentes
docenteRoutes.get('/', async (c) => {
    const tenantId = c.get('tenantId')
    const docentes = await prisma.docente.findMany({
        where: { tenantId, isActive: true }
    })
    return c.json({ data: docentes })
})

export { docenteRoutes }
