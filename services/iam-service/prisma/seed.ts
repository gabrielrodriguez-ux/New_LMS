
import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // 1. Create Tenant
    const tenantId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    // Note: Tenant table might complicate things if it's in a different service/schema?
    // IAM service schema has `User` but no `Tenant` model in the simplified version I saw?
    // Wait, IAM schema had `model Role` with `tenantId`.
    // It seems `Tenant` table is NOT in IAM schema? 
    // Let's check IAM schema again. It had `User`, `Role`, `UserRole`, `Session`, `ImportJob`.
    // It did NOT have `Tenant` or `Client`.
    // The `supabase_seed.sql` inserted into `public.clients`.
    // If `clients` table doesn't exist (because I wiped DB and only pushed IAM schema which lacks it), 
    // foreign keys might fail if `User` links to it? 
    // `User` has `tenantId` String. It does NOT have a @relation to Tenant/Client in the schema I saw.
    // So it's just a string. Safe to insert.

    // 2. Create Users
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash('password123', salt)

    const adminId = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01'
    const studentId = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03'

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
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
