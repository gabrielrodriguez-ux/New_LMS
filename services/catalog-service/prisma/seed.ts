
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Catalog & Users...')

    const tenantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    const courseId = 'eb15e6a0-3214-4ab4-95b4-2c832dec2639'

    // --- Users ---
    const passwordHash = '$2a$10$YourGeneratedHashHereOrSimilar'

    const adminId = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01'
    const studentId = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03'

    try {
        await prisma.user.upsert({
            where: { email: 'admin@thepower.education' },
            update: {},
            create: {
                id: adminId,
                tenantId,
                email: 'admin@thepower.education',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                passwordHash,
                status: 'active'
            }
        })

        await prisma.user.upsert({
            where: { email: 'student@thepower.education' },
            update: {},
            create: {
                id: studentId,
                tenantId,
                email: 'student@thepower.education',
                firstName: 'Student',
                lastName: 'User',
                role: 'student',
                passwordHash,
                status: 'active'
            }
        })
        console.log('✅ Users seeded')
    } catch (e) {
        // Ignore if user model issue (but simpler to crash)
        console.warn('User seed error:', e)
    }

    // --- Courses ---
    const course = await prisma.course.upsert({
        where: { id: courseId },
        update: {},
        create: {
            id: courseId,
            tenantId,
            title: 'ThePowerMBA Business Strategy',
            description: 'Master en estrategia de negocio y gestión empresarial.',
            shortDescription: 'Learn business strategy from the best.',
            hours: 40.0,
            level: 'advanced',
            status: 'published',
            fundaeCompatible: true,
            tags: ['business', 'strategy']
        }
    })

    console.log(`Course created: ${course.title}`)

    // 2. Create Modules
    const mod1 = await prisma.module.create({
        data: {
            courseId,
            title: 'Module 1: Introduction',
            description: 'Intro to Business Strategy',
            orderIndex: 0,
            type: 'video',
            units: {
                create: [
                    {
                        title: 'Unit 1.1: What is Strategy?',
                        orderIndex: 0,
                        contents: {
                            create: [
                                {
                                    title: 'Video: Strategy Basics',
                                    type: 'video',
                                    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                    orderIndex: 0
                                },
                                {
                                    title: 'Quiz: Basics',
                                    type: 'quiz',
                                    orderIndex: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log('✅ Catalog seeded')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
