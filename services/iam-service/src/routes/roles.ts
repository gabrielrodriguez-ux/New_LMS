/**
 * Role Routes
 * RBAC management
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const roleRoutes = new Hono()

const permissionSchema = z.object({
    resource: z.string(),
    actions: z.array(z.enum(['create', 'read', 'update', 'delete', 'manage']))
})

const createRoleSchema = z.object({
    name: z.string().min(2).max(50),
    displayName: z.string().min(2).max(100),
    permissions: z.array(permissionSchema)
})

// Default system roles with permissions
const SYSTEM_ROLES = [
    {
        name: 'alumno',
        displayName: 'Alumno',
        permissions: [
            { resource: 'courses', actions: ['read'] },
            { resource: 'enrollments', actions: ['read'] },
            { resource: 'progress', actions: ['read', 'update'] },
            { resource: 'certificates', actions: ['read'] },
            { resource: 'gamification', actions: ['read'] }
        ]
    },
    {
        name: 'docente',
        displayName: 'Docente',
        permissions: [
            { resource: 'courses', actions: ['read', 'update'] },
            { resource: 'enrollments', actions: ['read'] },
            { resource: 'progress', actions: ['read'] },
            { resource: 'attendance', actions: ['read', 'update'] },
            { resource: 'users', actions: ['read'] }
        ]
    },
    {
        name: 'manager',
        displayName: 'Manager',
        permissions: [
            { resource: 'courses', actions: ['read'] },
            { resource: 'enrollments', actions: ['read', 'create'] },
            { resource: 'progress', actions: ['read'] },
            { resource: 'users', actions: ['read'] },
            { resource: 'reports', actions: ['read'] }
        ]
    },
    {
        name: 'ld_manager',
        displayName: 'L&D Manager',
        permissions: [
            { resource: 'courses', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'enrollments', actions: ['create', 'read', 'update'] },
            { resource: 'progress', actions: ['read'] },
            { resource: 'users', actions: ['read'] },
            { resource: 'fundae', actions: ['read', 'create', 'update'] },
            { resource: 'reports', actions: ['read', 'create'] },
            { resource: 'docentes', actions: ['read', 'update'] }
        ]
    },
    {
        name: 'admin',
        displayName: 'Administrador',
        permissions: [
            { resource: 'users', actions: ['manage'] },
            { resource: 'roles', actions: ['manage'] },
            { resource: 'courses', actions: ['manage'] },
            { resource: 'enrollments', actions: ['manage'] },
            { resource: 'fundae', actions: ['manage'] },
            { resource: 'settings', actions: ['manage'] },
            { resource: 'integrations', actions: ['manage'] }
        ]
    },
    {
        name: 'c_level',
        displayName: 'C-Level',
        permissions: [
            { resource: 'reports', actions: ['read'] },
            { resource: 'analytics', actions: ['read'] },
            { resource: 'users', actions: ['read'] },
            { resource: 'courses', actions: ['read'] }
        ]
    }
]

// GET /api/roles
roleRoutes.get('/', async (c) => {
    const tenantId = c.get('tenantId')

    const roles = await prisma.role.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' }
    })

    return c.json({ data: roles })
})

// POST /api/roles (custom role)
roleRoutes.post('/', zValidator('json', createRoleSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    // Check if name already exists
    const existing = await prisma.role.findUnique({
        where: { tenantId_name: { tenantId, name: body.name } }
    })

    if (existing) {
        return c.json({ error: 'Role name already exists' }, 409)
    }

    const role = await prisma.role.create({
        data: {
            tenantId,
            name: body.name,
            displayName: body.displayName,
            permissions: body.permissions,
            isSystem: false
        }
    })

    return c.json(role, 201)
})

// POST /api/roles/seed - Initialize system roles for tenant
roleRoutes.post('/seed', async (c) => {
    const tenantId = c.get('tenantId')

    const created = []
    for (const roleData of SYSTEM_ROLES) {
        const existing = await prisma.role.findUnique({
            where: { tenantId_name: { tenantId, name: roleData.name } }
        })

        if (!existing) {
            const role = await prisma.role.create({
                data: {
                    tenantId,
                    name: roleData.name,
                    displayName: roleData.displayName,
                    permissions: roleData.permissions,
                    isSystem: true
                }
            })
            created.push(role.name)
        }
    }

    return c.json({
        message: 'System roles seeded',
        created
    })
})

// DELETE /api/roles/:id
roleRoutes.delete('/:id', async (c) => {
    const tenantId = c.get('tenantId')
    const { id } = c.req.param()

    const role = await prisma.role.findFirst({
        where: { id, tenantId }
    })

    if (!role) {
        return c.json({ error: 'Role not found' }, 404)
    }

    if (role.isSystem) {
        return c.json({ error: 'Cannot delete system role' }, 403)
    }

    await prisma.role.delete({ where: { id } })

    return c.json({ success: true })
})

export { roleRoutes }
