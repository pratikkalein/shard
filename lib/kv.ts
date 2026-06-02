// Upstash Redis via raw REST API — 100% fetch-based, works in Edge Runtime
// and Node.js (middleware + server components + API routes).
const KV_SET = "shard:public_canvases";

function base(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function redisGet<T>(path: string): Promise<T | null> {
  const conn = base();
  if (!conn) return null;
  try {
    const res = await fetch(`${conn.url}${path}`, {
      headers: { Authorization: `Bearer ${conn.token}` },
    });
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch {
    return null;
  }
}

async function redisPost(commands: unknown[][]): Promise<void> {
  const conn = base();
  if (!conn) throw new Error("Redis not configured");
  await fetch(`${conn.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${conn.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
}

export async function isPublic(slug: string): Promise<boolean> {
  const result = await redisGet<number>(
    `/sismember/${encodeURIComponent(KV_SET)}/${encodeURIComponent(slug)}`,
  );
  return result === 1;
}

export async function setPublic(slug: string, pub: boolean): Promise<void> {
  const cmd = pub ? "sadd" : "srem";
  await redisPost([[cmd, KV_SET, slug]]);
}

export async function listPublic(): Promise<string[]> {
  const result = await redisGet<string[]>(
    `/smembers/${encodeURIComponent(KV_SET)}`,
  );
  return result ?? [];
}
