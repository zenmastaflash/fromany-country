// src/middleware.ts

// export { default } from "next-auth/middleware"; // Comment this out temporarily

export const config = {
  matcher: [
    '/documents/:path*',
    '/dashboard/:path*',
    '/travel/:path*',
    '/api/documents/:path*',
    '/api/travel/:path*'
  ]
};
