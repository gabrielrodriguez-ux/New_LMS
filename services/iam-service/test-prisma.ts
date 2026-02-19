
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing Prisma User Creation...')
        const user = await prisma.user.create({
            data: {
                email: `test.script.${Date.now()}@example.com`,
                firstName: 'Test',
                lastName: 'Script',
                role: 'student',
                status: 'active',
                tenantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
            }
        })
        console.log('Success:', user)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
