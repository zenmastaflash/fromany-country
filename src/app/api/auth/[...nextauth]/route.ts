import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

// Create a NextAuth handler from your config
const handler = NextAuth(authConfig);

// Export as GET and POST
export { handler as GET, handler as POST };
