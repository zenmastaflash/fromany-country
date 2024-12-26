export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/documents/:path*',
    '/dashboard/:path*',
    '/api/documents/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
