import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

export const runtime = 'nodejs' // Add this line to force Node.js runtime

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };