import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, displayName } = await req.json();
  const hashedPassword = await hash(password, 12);
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
        terms_accepted_at: new Date()
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }
}
