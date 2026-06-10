import { S3Client, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";
import { JSONCanvas } from "./types";
import { ContentStorage } from "./storage";

const BUCKET = process.env.R2_BUCKET ?? "shard-content";
const publicUrlBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error("Missing R2 environment variables");
    }
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3ClientInstance;
}

export class R2Storage implements ContentStorage {
  async listCanvases(): Promise<string[]> {
    try {
      const s3 = getS3Client();
      const response = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
      const contents = response.Contents ?? [];
      return contents
        .map((item) => item.Key)
        .filter((key): key is string => !!key && key.toLowerCase().endsWith(".canvas"))
        .map((key) => key.slice(0, -".canvas".length))
        .sort((a, b) => a.localeCompare(b));
    } catch (err) {
      console.error("Error listing canvases from R2:", err);
      return [];
    }
  }

  async listMarkdown(): Promise<string[]> {
    try {
      const s3 = getS3Client();
      const response = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
      const contents = response.Contents ?? [];
      return contents
        .map((item) => item.Key)
        .filter((key): key is string => !!key && key.toLowerCase().endsWith(".md"))
        .map((key) => key.slice(0, -".md".length))
        .sort((a, b) => a.localeCompare(b));
    } catch (err) {
      console.error("Error listing markdown from R2:", err);
      return [];
    }
  }

  async readCanvas(slug: string): Promise<JSONCanvas | null> {
    try {
      const s3 = getS3Client();
      const response = await s3.send(
        new GetObjectCommand({ Bucket: BUCKET, Key: `${slug}.canvas` })
      );
      const body = await response.Body?.transformToString();
      return body ? (JSON.parse(body) as JSONCanvas) : null;
    } catch (err: any) {
      if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw err;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      const s3 = getS3Client();
      const response = await s3.send(
        new GetObjectCommand({ Bucket: BUCKET, Key: filePath })
      );
      const body = await response.Body?.transformToString();
      return body ?? null;
    } catch (err: any) {
      if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw err;
    }
  }

  getPublicUrl(filePath: string): string {
    return publicUrlBase + "/" + filePath.split("/").map(encodeURIComponent).join("/");
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      const s3 = getS3Client();
      await s3.send(
        new HeadObjectCommand({ Bucket: BUCKET, Key: filePath })
      );
      return true;
    } catch (err: any) {
      if (err.name === "NotFound" || err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }
}

let r2StorageInstance: R2Storage | null = null;

export function getR2Storage(): ContentStorage {
  if (!r2StorageInstance) {
    r2StorageInstance = new R2Storage();
  }
  return r2StorageInstance;
}
