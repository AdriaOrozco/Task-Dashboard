import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

// Users are stored in Firestore instead of using Firebase Authentication,
// because authentication and session management is handled via NextAuth

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
