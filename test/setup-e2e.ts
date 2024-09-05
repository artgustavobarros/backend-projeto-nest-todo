import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

function generateUniqueDatabaseURL(databaseName: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.pathname = `/${databaseName}`

  return url.toString()
}

const prismaAdmin = new PrismaClient()
const databaseTestingId = randomUUID()

beforeAll(async () => {
  const testDatabaseName = `test-${databaseTestingId}`

  await prismaAdmin.$executeRawUnsafe(
    `CREATE DATABASE \`${testDatabaseName}\`;`,
  )

  const databaseURL = generateUniqueDatabaseURL(testDatabaseName)
  process.env.DATABASE_URL = databaseURL

  const prisma = new PrismaClient()

  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
  })

  await prisma.$queryRaw`SHOW DATABASES`
  await prisma.$connect()
})

afterAll(async () => {
  await prismaAdmin.$disconnect()

  const prismaAdminAgain = new PrismaClient()

  const testDatabaseName = `test-${databaseTestingId}`
  await prismaAdminAgain.$executeRawUnsafe(
    `DROP DATABASE IF EXISTS \`${testDatabaseName}\`;`,
  )

  await prismaAdminAgain.$disconnect()
})
