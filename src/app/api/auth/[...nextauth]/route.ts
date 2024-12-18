import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';

export const { handlers } = NextAuth(authConfig);

export const { GET, POST } = handlers;