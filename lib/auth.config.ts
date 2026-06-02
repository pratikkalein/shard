// Edge-compatible auth config — used in middleware (no Node.js-only APIs).
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [Google],
  pages: { signIn: "/login" },
  callbacks: {
    // The real email check happens in lib/auth.ts signIn callback.
    // Here we only verify a session exists (token is present).
    authorized({ auth }) {
      return !!auth;
    },
  },
};
