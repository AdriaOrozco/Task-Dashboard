import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";

// Users are stored in Firestore instead of using Firebase Authentication,
// because authentication and session management is handled via NextAuth

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const usersRef = db.collection("users");
        const snapshot = await usersRef
          .where("email", "==", credentials.email)
          .get();

        if (snapshot.empty) return null;

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) return null;

        return {
          id: userDoc.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
