import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPublic } from "@/lib/kv";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const [session, pub] = await Promise.all([auth(), isPublic(name)]);
  return NextResponse.json({ isPublic: pub, isOwner: !!session });
}
