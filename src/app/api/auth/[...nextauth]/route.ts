import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : '/documents'
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  }
})

export const GET = handler
export const POST = handler