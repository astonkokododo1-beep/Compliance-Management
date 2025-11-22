import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const employeePassword = await bcrypt.hash('Employee123!', 10)

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'System Administrator',
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  })

  const compliance = await prisma.user.upsert({
    where: { email: 'compliance@company.com' },
    update: {},
    create: {
      email: 'compliance@company.com',
      name: 'Compliance Officer',
      password: adminPassword,
      role: Role.COMPLIANCE_OFFICER,
      emailVerified: new Date(),
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
      email: 'employee@company.com',
      name: 'John Employee',
      password: employeePassword,
      role: Role.EMPLOYEE,
      emailVerified: new Date(),
    },
  })

  // Sample policies
  await prisma.policy.createMany({
    data: [
      {
        title: 'Anti-Bribery Policy',
        category: 'ABAC',
        content: '...comprehensive anti-bribery policy...',
        version: '1.0',
        status: 'published',
        aiGenerated: true,
        createdBy: admin.id,
      },
      {
        title: 'Gift & Hospitality Guidelines',
        category: 'GHE',
        content: '...gift and hospitality policy...',
        version: '1.0',
        status: 'published',
        createdBy: admin.id,
      },
    ],
  })

  console.log('✅ Database seeded successfully')
  console.log('🔑 Admin login: admin@company.com / Admin123!')
  console.log('👤 Employee login: employee@company.com / Employee123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
