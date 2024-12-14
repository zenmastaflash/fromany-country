import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const runtime = 'edge'

const auth = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
})

export const GET = auth
export const POST = auth