
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Comprehensive Seed...')

    // --- Config ---
    const TENANT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    const PASSWORD_HASH = await bcrypt.hash('password123', 10)

    // --- Clear DB (Optional, be careful in prod) ---
    // await prisma.$executeRaw`TRUNCATE TABLE users, courses, modules, units, contents, enrollments, progress, comments CASCADE`

    // --- 1. Users ---
    console.log('👤 Seeding Users...')
    const roles = ['admin', 'manager', 'docente', 'student']
    const users = []

    // Admin
    users.push(await prisma.user.upsert({
        where: { email: 'admin@thepower.education' },
        update: {},
        create: {
            id: faker.string.uuid(),
            tenantId: TENANT_ID,
            email: 'admin@thepower.education',
            firstName: 'Admin',
            lastName: 'System',
            role: 'admin',
            passwordHash: PASSWORD_HASH,
            status: 'active',
            avatarUrl: faker.image.avatar()
        }
    }))

    // Student
    users.push(await prisma.user.upsert({
        where: { email: 'student@thepower.education' },
        update: {},
        create: {
            id: faker.string.uuid(),
            tenantId: TENANT_ID,
            email: 'student@thepower.education',
            firstName: 'Student',
            lastName: 'Demo',
            role: 'student',
            passwordHash: PASSWORD_HASH,
            status: 'active',
            avatarUrl: faker.image.avatar()
        }
    }))

    // Generate 50 random users
    for (let i = 0; i < 50; i++) {
        const role = faker.helpers.arrayElement(roles)
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = faker.internet.email({ firstName, lastName }).toLowerCase()

        const user = await prisma.user.create({
            data: {
                tenantId: TENANT_ID,
                firstName,
                lastName,
                email,
                role,
                passwordHash: PASSWORD_HASH,
                status: 'active',
                jobTitle: faker.person.jobTitle(),
                avatarUrl: faker.image.avatar(),
                createdAt: faker.date.past()
            }
        })
        users.push(user)
    }

    // --- 2. Courses ---
    console.log('📚 Seeding Courses...')
    const courses = []

    // Static Course (Master)
    const masterCourse = await prisma.course.upsert({
        where: { id: 'eb15e6a0-3214-4ab4-95b4-2c832dec2639' },
        update: {},
        create: {
            id: 'eb15e6a0-3214-4ab4-95b4-2c832dec2639',
            tenantId: TENANT_ID,
            title: 'ThePowerMBA Business Strategy',
            description: 'Master en estrategia de negocio y gestión empresarial.',
            shortDescription: 'Learn business strategy from the best.',
            hours: 40.0,
            level: 'advanced',
            status: 'published',
            thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
            tags: ['business', 'strategy']
        }
    })
    courses.push(masterCourse)

    // Generate 10 Random Courses
    for (let i = 0; i < 10; i++) {
        const title = faker.company.catchPhrase()
        const course = await prisma.course.create({
            data: {
                tenantId: TENANT_ID,
                title: title,
                description: faker.lorem.paragraph(),
                shortDescription: faker.lorem.sentence(),
                hours: faker.number.float({ min: 10, max: 100, precision: 0.1 }),
                level: faker.helpers.arrayElement(['basico', 'intermedio', 'avanzado']),
                status: 'published',
                thumbnailUrl: faker.image.urlLoremFlickr({ category: 'business' }),
                tags: [faker.word.noun(), faker.word.noun()]
            }
        })
        courses.push(course)
    }

    // --- 3. Modules, Units, Contents ---
    console.log('📦 Seeding Modules & Content...')
    const allContentIds: string[] = []

    for (const course of courses) {
        const numModules = faker.number.int({ min: 3, max: 8 })

        for (let m = 0; m < numModules; m++) {
            const module = await prisma.module.create({
                data: {
                    courseId: course.id,
                    title: `Module ${m + 1}: ${faker.commerce.department()}`,
                    description: faker.lorem.sentence(),
                    orderIndex: m,
                    type: 'mixed',
                    units: {
                        create: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map((_, u) => ({
                            title: `Unit ${m + 1}.${u + 1}: ${faker.hacker.verb()}`,
                            orderIndex: u,
                            contents: {
                                create: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map((_, c) => {
                                    const type = faker.helpers.arrayElement(['video', 'text', 'quiz'])
                                    return {
                                        title: `${faker.hacker.noun()} ${type}`,
                                        type,
                                        contentUrl: type === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
                                        body: type === 'text' ? faker.lorem.paragraphs(3) : undefined,
                                        orderIndex: c
                                    }
                                })
                            }
                        }))
                    }
                },
                include: {
                    units: {
                        include: {
                            contents: true
                        }
                    }
                }
            })

            // Collect content IDs for progress/comments
            module.units.forEach(u => u.contents.forEach(c => allContentIds.push(c.id)))
        }
    }

    // --- 4. Enrollments ---
    console.log('🎓 Seeding Enrollments...')
    const students = users.filter(u => u.role === 'student')

    for (const student of students) {
        // Enroll in 1-5 courses
        const randomizedCourses = faker.helpers.arrayElements(courses, faker.number.int({ min: 1, max: 5 }))

        for (const course of randomizedCourses) {
            await prisma.enrollment.create({
                data: {
                    tenantId: TENANT_ID,
                    userId: student.id,
                    courseId: course.id,
                    status: faker.helpers.arrayElement(['assigned', 'in_progress', 'completed']),
                    progress: faker.number.int({ min: 0, max: 100 }),
                    assignedAt: faker.date.past()
                }
            }).catch(() => { }) // Ignore duplicates
        }
    }

    // --- 5. Progress ---
    // Omitted for brevity/complexity, but could loop enrollments and create Module progress.

    // --- 6. Comments ---
    console.log('💬 Seeding Comments...')
    for (let i = 0; i < 100; i++) {
        const user = faker.helpers.arrayElement(users)
        const contentId = faker.helpers.arrayElement(allContentIds) // This needs Content ID, schema uses courseId for Comment? 
        // Wait, Comment schema:
        // model Comment { courseId, userId, content, parentId }
        // It doesn't link to Content/Unit/Module explicitly in the schema I merged?
        // Let's check schema. `model Comment { id, courseId, userId, content ... }`
        // It seems comments are at COURSE level in this schema? Or maybe `parentId` is used?
        // Assumed Course Level for now.

        const course = faker.helpers.arrayElement(courses)

        await prisma.comment.create({
            data: {
                courseId: course.id,
                userId: user.id,
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent()
            }
        })
    }

    console.log('✅ Comprehensive Seed Completed!')
}

main()
    .catch((e) => {
        console.error(e)
        // process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
