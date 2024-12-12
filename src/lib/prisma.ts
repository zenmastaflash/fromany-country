import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Only register event listeners in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('error' as any, (e: any) => {
    console.error('Prisma Error:', e);
  });

  prisma.$on('warn' as any, (e: any) => {
    console.warn('Prisma Warning:', e);
  });
}