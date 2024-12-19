import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'edge';

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;