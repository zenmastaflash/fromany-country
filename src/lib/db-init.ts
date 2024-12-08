import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Database initialization check started...');
  
  try {
    // Check if we can connect to the database
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Perform a simple query to verify schema
    const userCount = await prisma.user.count();
    console.log(`Current user count: ${userCount}`);
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();