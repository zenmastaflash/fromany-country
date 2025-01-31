import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    // Check if user has accepted terms
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/check-terms`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const { terms_accepted } = await response.json()
        
        if (!terms_accepted && !req.nextUrl.pathname.startsWith('/auth/')) {
          return NextResponse.redirect(new URL('/auth/terms', req.url))
        }
      } catch (error) {
        console.error('Error checking terms:', error)
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/documents/:path*',
    '/dashboard/:path*',
    '/travel/:path*',
    '/api/documents/:path*',
    '/api/travel/:path*'
  ]
}
