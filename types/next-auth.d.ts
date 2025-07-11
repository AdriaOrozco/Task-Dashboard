import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "Admin" | "Worker";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "Admin" | "Worker";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "Admin" | "Worker";
  }
}
