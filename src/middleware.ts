import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    return req.nextResponse
  }
)

export const config = {
  matcher: [
    '/documents/:path*',
    '/dashboard/:path*',
    '/travel/:path*',
    '/api/documents/:path*',
    '/api/travel/:path*',
    '/auth/signup',
    '/auth/terms'
  ]
};
