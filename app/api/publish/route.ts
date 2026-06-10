import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { setPublic } from "@/lib/kv";

export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("Authorization");
  const expectedKey = process.env.SHARD_PUBLISH_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: SHARD_PUBLISH_KEY not set" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, visibility } = body;

    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Invalid or missing slug" }, { status: 400 });
    }

    if (visibility !== "public" && visibility !== "private") {
      return NextResponse.json({ error: "Invalid visibility: must be 'public' or 'private'" }, { status: 400 });
    }

    // Update Redis KV
    const isPub = visibility === "public";
    await setPublic(slug, isPub);

    // Trigger on-demand ISR revalidation
    revalidatePath("/" + slug);
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({
      ok: true,
      url: "/" + slug,
    });
  } catch (err: any) {
    console.error("Publish error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to publish" },
      { status: 500 }
    );
  }
}
