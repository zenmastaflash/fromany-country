// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    if (!token?.email) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: { terms_accepted_at: true }
    })

    if (!user?.terms_accepted_at && !req.nextUrl.pathname.startsWith('/auth/terms')) {
      return NextResponse.redirect(new URL('/auth/terms', req.url))
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
