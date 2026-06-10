import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/storage-r2";
import { setPublic } from "@/lib/kv";

const BUCKET = process.env.R2_BUCKET ?? "shard-content";

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
    const { slug, files } = body;

    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Invalid or missing slug" }, { status: 400 });
    }

    const s3 = getS3Client();

    // 1. Delete the canvas and/or markdown files associated with the slug
    const keysToDelete = [`${slug}.canvas`, `${slug}.md`].filter(Boolean);

    // 2. If client specified additional files to delete, add them
    if (Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        if (typeof file === "string" && file && !keysToDelete.includes(file)) {
          keysToDelete.push(file);
        }
      }
    }

    // Delete objects from R2
    if (keysToDelete.length > 0) {
      if (keysToDelete.length === 1) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: keysToDelete[0],
          })
        );
      } else {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: {
              Objects: keysToDelete.map((key) => ({ Key: key })),
              Quiet: true,
            },
          })
        );
      }
    }

    // 3. Remove from Redis KV (unpublish)
    await setPublic(slug, false);

    // 4. Trigger on-demand ISR revalidation
    revalidatePath("/" + slug);
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Unpublish error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to unpublish" },
      { status: 500 }
    );
  }
}
