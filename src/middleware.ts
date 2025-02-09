// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    // Store the token info in headers for our API routes
    const requestHeaders = new Headers(req.headers)
    if (token?.email) {
      requestHeaders.set('x-user-email', token.email)
    }

    // Only redirect to terms if explicitly requested by API
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
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
