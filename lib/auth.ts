import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        if (email !== process.env.ALLOWED_EMAIL) return null;
        const hash = process.env.CREDENTIALS_PASSWORD_HASH;
        if (!hash) return null;
        const ok = await bcrypt.compare(password, hash);
        return ok ? { id: "owner", email } : null;
      },
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email === process.env.ALLOWED_EMAIL;
      }
      return true;
    },
  },
});
