import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getStorage } from "@/lib/storage";
import { listPublic, setPublic, isRedisConfigured } from "@/lib/kv";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const redisReady = isRedisConfigured();

  const storage = getStorage();
  const [canvases, markdowns, publicSlugs] = await Promise.all([
    storage.listCanvases(),
    storage.listMarkdown(),
    listPublic(),
  ]);
  const items = [
    ...canvases.map((slug) => ({ slug, type: "canvas" as const })),
    ...markdowns.map((slug) => ({ slug, type: "markdown" as const })),
  ].sort((a, b) => a.slug.localeCompare(b.slug));
  const publicSet = new Set(publicSlugs);

  async function toggle(formData: FormData) {
    "use server";
    const slug = formData.get("slug") as string;
    const current = formData.get("current") === "true";
    await setPublic(slug, !current);
    revalidatePath("/admin");
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <Link href="/" className="admin-back">← Canvases</Link>
        <h1 className="admin-title">Publish settings</h1>
      </div>

      {!redisReady && (
        <div className="admin-notice">
          <strong>Upstash Redis not connected.</strong> Publish/unpublish toggles
          won&apos;t persist until you connect a Redis database.{" "}
          <a
            href="https://vercel.com/integrations?search=upstash"
            target="_blank"
            rel="noreferrer"
          >
            Set it up in Vercel Integrations →
          </a>
        </div>
      )}

      {items.length === 0 ? (
        <p className="empty-body">No content in storage yet.</p>
      ) : (
        <ul className="admin-list">
          {items.map(({ slug, type }) => {
            const pub = publicSet.has(slug);
            return (
              <li key={slug} className="admin-item">
                <div className="admin-item-left">
                  <Link href={`/${encodeURIComponent(slug)}`} className="admin-canvas-name">
                    {slug}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "6px" }}>
                      ({type})
                    </span>
                  </Link>
                  <span className={`admin-badge ${pub ? "badge-public" : "badge-private"}`}>
                    {pub ? "Public" : "Private"}
                  </span>
                </div>
                <form action={toggle}>
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="current" value={String(pub)} />
                  <button
                    type="submit"
                    disabled={!redisReady}
                    className={`admin-toggle ${pub ? "toggle-unpublish" : "toggle-publish"}`}
                    title={!redisReady ? "Connect Upstash Redis first" : undefined}
                  >
                    {pub ? "Make private" : "Publish"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
