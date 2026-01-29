import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'


type Variables = {
    tenantId: string
    userId: string
    roles: string[]
}

const aiRoutes = new Hono<{ Variables: Variables }>()

// Mock storage for jobs
const jobs = new Map()

const generateSchema = z.object({
    sourceIds: z.array(z.string()),
    type: z.enum(['podcast', 'video', 'summary']),
    config: z.record(z.any()).optional()
})

// POST /api/ai/upload-source
// Returns a presigned URL (mocked for now) to upload file directly to storage
aiRoutes.post('/upload-source', async (c) => {
    const tenantId = c.get('tenantId')
    const { fileName, fileType } = await c.req.json()

    // working with Supabase Storage, we would generate a signed upload URL here.
    // For now, we'll return a mock succes response.

    const mockFileId = crypto.randomUUID()

    return c.json({
        fileId: mockFileId,
        uploadUrl: `https://mock-storage.com/${tenantId}/${mockFileId}`,
        publicUrl: `https://mock-storage.com/${tenantId}/${mockFileId}/${fileName}`
    })
})

// POST /api/ai/generate
aiRoutes.post('/generate', zValidator('json', generateSchema), async (c) => {
    const tenantId = c.get('tenantId')
    const body = c.req.valid('json')

    const jobId = crypto.randomUUID()

    // Create a mock job
    jobs.set(jobId, {
        id: jobId,
        status: 'processing',
        type: body.type,
        createdAt: new Date(),
        progress: 0
    })

    // Simulate async processing
    setTimeout(() => {
        const job = jobs.get(jobId)
        if (job) {
            job.status = 'completed'
            job.progress = 100
            job.result = {
                title: `Generated ${body.type} from ${body.sourceIds.length} sources`,
                url: body.type === 'podcast'
                    ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Public MP3 for testing
                    : 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', // Public Video
                duration: '12:45'
            }
            jobs.set(jobId, job)
        }
    }, 5000)

    return c.json({ jobId, status: 'processing' }, 202)
})

// GET /api/ai/jobs/:id
aiRoutes.get('/jobs/:id', async (c) => {
    const { id } = c.req.param()
    const job = jobs.get(id)

    if (!job) {
        return c.json({ error: 'Job not found' }, 404)
    }

    return c.json(job)
})

export { aiRoutes }
