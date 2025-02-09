import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection
  maxUses: 7500, // number of times a connection can be used before being closed
})

// Add event listeners for debugging in development
if (process.env.NODE_ENV !== 'production') {
  pool.on('connect', () => console.log('Pool connected'))
  pool.on('error', (err) => console.error('Pool error:', err))
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

if (!globalForPrisma.pool) {
  globalForPrisma.pool = pool
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(globalForPrisma.pool),
  log: ['error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Cleanup function
process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})
