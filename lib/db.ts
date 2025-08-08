// lib/db.ts ou lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma 

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db