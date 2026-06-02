import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { setPublic } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, public: pub } = await req.json();
  if (typeof slug !== "string" || typeof pub !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await setPublic(slug, pub);
  return NextResponse.json({ slug, public: pub });
}
