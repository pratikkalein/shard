import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "@/lib/storage-r2";

const BUCKET = process.env.R2_BUCKET ?? "shard-content";

const ALLOWED_EXTENSIONS = new Set([
  ".canvas",
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".avif",
]);

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
    const { files } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Invalid body: 'files' must be a non-empty array of file paths" },
        { status: 400 }
      );
    }

    // Validate file extensions
    for (const file of files) {
      if (typeof file !== "string" || file.includes("..")) {
        return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
      }
      const dotIndex = file.lastIndexOf(".");
      if (dotIndex === -1) {
        return NextResponse.json({ error: "Files must have extensions" }, { status: 400 });
      }
      const ext = file.substring(dotIndex).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `File extension '${ext}' is not allowed` },
          { status: 400 }
        );
      }
    }

    const s3 = getS3Client();
    const urls: Record<string, string> = {};

    for (const file of files) {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: file,
      });
      // Generate presigned URL valid for 15 minutes (900 seconds)
      const url = await getSignedUrl(s3, command, { expiresIn: 900 });
      urls[file] = url;
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error("Presign error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}
