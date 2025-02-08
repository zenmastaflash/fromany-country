import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    // Check if user has accepted terms
    if (token) {
      try {
        const url = new URL('/api/auth/accept-terms', process.env.NEXTAUTH_URL || req.url)
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token.raw}` }
        })
        
        if (!response.ok) throw new Error(await response.text())
        const data = await response.json()
        
        if (!data.terms_accepted && !req.nextUrl.pathname.startsWith('/auth/')) {
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
