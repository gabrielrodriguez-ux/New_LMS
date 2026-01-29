/**
 * Report Routes
 * Export PDF/XML/Excel
 */

import { Hono } from 'hono'
import { prisma } from '../lib/prisma'

const reportRoutes = new Hono()

// GET /api/fundae/reports/export?format=pdf|xml&expedientId=...
reportRoutes.get('/export', async (c) => {
    const tenantId = c.get('tenantId')
    const { format, expedientId } = c.req.query()

    if (!expedientId) return c.json({ error: 'Expedient ID required' }, 400)
    if (!['pdf', 'xml', 'excel'].includes(format || '')) return c.json({ error: 'Invalid format' }, 400)

    // Fetch full tree
    const expedient = await prisma.fundaeExpedient.findFirst({
        where: { id: expedientId, tenantId },
        include: { participants: true }
    })

    if (!expedient) return c.json({ error: 'Expedient not found' }, 404)

    if (format === 'xml') {
        // Mock XML generation
        const xmlContent = `<expediente id="${expedient.id}"><empresa>${expedient.empresaNombre}</empresa></expediente>`
        c.header('Content-Type', 'application/xml')
        c.header('Content-Disposition', `attachment; filename=fundae-${expedient.id}.xml`)
        return c.body(xmlContent)
    }

    // Default PDF/Excel mock
    return c.json({
        message: `${format.toUpperCase()} generation queued`,
        url: `https://mock-storage.com/${tenantId}/${expedient.id}.${format}`
    })
})

export { reportRoutes }
