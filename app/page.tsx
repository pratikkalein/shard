import Link from "next/link";
import { getStorage } from "@/lib/storage";

export default async function Home() {
  const storage = getStorage();
  const [canvases, markdowns] = await Promise.all([
    storage.listCanvases(),
    storage.listMarkdown(),
  ]);

  const items = [
    ...canvases.map((slug) => ({ slug, type: "canvas" as const })),
    ...markdowns.map((slug) => ({ slug, type: "markdown" as const })),
  ].sort((a, b) => a.slug.localeCompare(b.slug));

  return (
    <main className="home">
      <Link href="/admin" className="admin-link">Publish settings</Link>
      <div className="home-header">
        <div className="shard-logo" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
            <polygon points="24,2 44,14 24,18" fill="#7c3aed" opacity="0.6" />
            <polygon points="24,2 4,14 24,18" fill="#a78bfa" opacity="0.4" />
            <polygon points="4,14 24,18 4,34" fill="#7c3aed" opacity="0.25" />
            <polygon points="44,14 24,18 44,34" fill="#a78bfa" opacity="0.2" />
            <polygon points="24,18 4,34 24,46 44,34" fill="#7c3aed" opacity="0.35" />
            <line x1="24" y1="2" x2="24" y2="18" stroke="#a78bfa" strokeWidth="1" opacity="0.5" />
            <line x1="4" y1="14" x2="44" y2="14" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
            <line x1="4" y1="34" x2="44" y2="34" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
        <h1 className="shard-title">Shard</h1>
        <p className="shard-tagline">Publish your Obsidian vault to the web</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No content published yet</p>
          <p className="empty-body">
            Publish a canvas or markdown file from Obsidian to see it here.
          </p>
        </div>
      ) : (
        <>
          <p className="canvas-section-label">{items.length} published file{items.length !== 1 ? "s" : ""}</p>
          <ul className="canvas-list">
            {items.map(({ slug, type }) => (
              <li key={slug}>
                <Link href={`/${encodeURIComponent(slug)}`} className="canvas-card">
                  {type === "canvas" ? (
                    <svg className="canvas-card-icon" width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="2" />
                      <polygon points="24,2 44,14 24,18" fill="currentColor" opacity="0.5" />
                      <polygon points="24,18 4,34 24,46 44,34" fill="currentColor" opacity="0.3" />
                    </svg>
                  ) : (
                    <svg className="canvas-card-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  )}
                  <span className="canvas-card-name">{slug}</span>
                  <span className="canvas-card-arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
