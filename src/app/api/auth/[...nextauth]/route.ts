import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  })],
  secret: process.env.NEXTAUTH_SECRET
})

export const GET = handler
export const POST = handler