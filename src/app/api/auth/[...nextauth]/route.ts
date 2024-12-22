// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const runtime = 'nodejs'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: { 
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV !== 'production'
})

export { handler as GET, handler as POST }
