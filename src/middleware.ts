// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    if (!token?.email) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Terms version check without database call
    const terms_accepted_at = token.terms_accepted_at
    const terms_version = token.terms_version
    
    const needsTerms = !terms_accepted_at || terms_version !== 1 // Current version
    
    // Instead of redirecting to /auth/terms, add query param to show terms drawer
    if (needsTerms) {
      return NextResponse.redirect(new URL(`/dashboard?showTerms=true`, req.url))
    }

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-email', token.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
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
