import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: [
    { level: 'error', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Test database connection on startup
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
    });
  });