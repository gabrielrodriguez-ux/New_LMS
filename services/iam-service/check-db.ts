import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL?.replace('5432', '6543'),
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    console.log("Testing Prisma Connection...")
    console.log("URL:", process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@')) // Hide password
    try {
        const users = await prisma.user.findMany({ take: 1 })
        console.log("✅ Connection Successful! Found users:", users.length)
        console.log(users)
    } catch (e) {
        console.error("❌ Connection Failed:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
