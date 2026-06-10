import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { isPublic } from "@/lib/kv";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Canvas pages: /anything-that-is-a-slug (single path segment, not admin)
  const slugMatch = pathname.match(/^\/([^/]+)$/) ;
  const slug = slugMatch?.[1];
  if (slug && slug !== "admin" && slug !== "login" && !slug.startsWith("_")) {
    const pub = await isPublic(decodeURIComponent(slug));
    if (pub) return NextResponse.next();
  }

  // Unauthenticated → login
  if (!session) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Protect everything except: login, API routes, Next.js internals,
  // static files, and the public content folder.
  matcher: [
    "/((?!api/|login|_next/static|_next/image|favicon.ico|content/).*)",
  ],
};
