import { App, TFile, requestUrl } from "obsidian";
import { getDependencies } from "./canvas-parser";
import { ShardPublishSettings } from "./settings";

function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    canvas: "application/json",
    md: "text/markdown",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return contentTypes[ext.toLowerCase()] || "application/octet-stream";
}

/**
 * Main publish orchestrator.
 * 1. Resolves all file dependencies.
 * 2. Gets presigned R2 upload URLs from Shard API.
 * 3. Uploads files directly to R2.
 * 4. Informs Shard API to register and revalidate the page.
 */
export async function publishFile(
  app: App,
  file: TFile,
  settings: ShardPublishSettings,
  visibility: "public" | "private"
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { shardUrl, apiKey } = settings;

  if (!shardUrl || !apiKey) {
    return { ok: false, error: "Shard URL and API Key must be configured in settings." };
  }

  try {
    // 1. Resolve dependencies
    const deps = await getDependencies(app, file);
    const filesToUpload = [file, ...deps];

    // 2. Request presigned URLs
    const presignResponse = await requestUrl({
      url: `${shardUrl}/api/upload/presign`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        files: filesToUpload.map((f) => f.path),
      }),
    });

    if (presignResponse.status !== 200) {
      const errorMsg = presignResponse.json?.error || `Failed to get upload URLs (${presignResponse.status})`;
      return { ok: false, error: errorMsg };
    }

    const { urls } = presignResponse.json;

    // 3. Upload all files via PUT
    for (const f of filesToUpload) {
      const uploadUrl = urls[f.path];
      if (!uploadUrl) {
        return { ok: false, error: `Missing upload URL for file: ${f.path}` };
      }

      const binaryData = await app.vault.readBinary(f);

      const uploadResponse = await requestUrl({
        url: uploadUrl,
        method: "PUT",
        headers: {
          "Content-Type": getContentType(f.extension),
        },
        body: binaryData,
      });

      if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
        return { ok: false, error: `Failed to upload file ${f.name} to R2 (${uploadResponse.status})` };
      }
    }

    // 4. Notify Shard of publication
    const slug = file.path.substring(0, file.path.length - file.extension.length - 1);
    const type = file.extension === "canvas" ? "canvas" : "markdown";

    const publishResponse = await requestUrl({
      url: `${shardUrl}/api/publish`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        slug,
        type,
        visibility,
        files: filesToUpload.map((f) => f.path),
      }),
    });

    if (publishResponse.status !== 200) {
      const errorMsg = publishResponse.json?.error || `Failed to publish to Shard (${publishResponse.status})`;
      return { ok: false, error: errorMsg };
    }

    const { url } = publishResponse.json;
    return { ok: true, url: shardUrl + url };
  } catch (err: any) {
    console.error("Publishing process failed:", err);
    return { ok: false, error: err.message || "An unexpected error occurred during publishing" };
  }
}

/**
 * Remove a published canvas/file from Shard and delete its assets.
 */
export async function unpublishFile(
  app: App,
  file: TFile,
  settings: ShardPublishSettings
): Promise<{ ok: boolean; error?: string }> {
  const { shardUrl, apiKey } = settings;

  if (!shardUrl || !apiKey) {
    return { ok: false, error: "Shard URL and API Key must be configured in settings." };
  }

  try {
    const deps = await getDependencies(app, file);
    const filesToDelete = [file, ...deps];
    const slug = file.path.substring(0, file.path.length - file.extension.length - 1);

    const response = await requestUrl({
      url: `${shardUrl}/api/publish/unpublish`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        slug,
        files: filesToDelete.map((f) => f.path),
      }),
    });

    if (response.status !== 200) {
      const errorMsg = response.json?.error || `Failed to unpublish (${response.status})`;
      return { ok: false, error: errorMsg };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Unpublishing failed:", err);
    return { ok: false, error: err.message || "An unexpected error occurred during unpublishing" };
  }
}
