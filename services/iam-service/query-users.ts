import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  console.log('Total users:', userCount)
  if (userCount > 0) {
    const users = await prisma.user.findMany({
      take: 5,
      select: { email: true, tenantId: true, createdAt: true }
    })
    console.log('Sample users:', users)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
