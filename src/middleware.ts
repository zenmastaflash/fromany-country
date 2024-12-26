export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/documents/:path*',
    '/dashboard/:path*',
    '/travel/:path*',
    '/api/documents/:path*',
    '/api/travel/:path*'
  ]
};
