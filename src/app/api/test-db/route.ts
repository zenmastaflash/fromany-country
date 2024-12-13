import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount
    });
  } catch (error) {
    console.error('Database connection error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    });
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
      details: error instanceof Error ? error.constructor.name : 'Unknown error type'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}