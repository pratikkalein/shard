import Link from "next/link";
import { listCanvases } from "@/lib/canvas";

export default function Home() {
  const canvases = listCanvases();

  return (
    <main className="home">
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
        <p className="shard-tagline">Publish your Obsidian canvases to the web</p>
      </div>

      {canvases.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No canvases published yet</p>
          <p className="empty-body">
            Drop a <code>.canvas</code> file into <code>public/content/</code> and push to publish it.
          </p>
        </div>
      ) : (
        <>
          <p className="canvas-section-label">{canvases.length} canvas{canvases.length !== 1 ? "es" : ""}</p>
          <ul className="canvas-list">
            {canvases.map((slug) => (
              <li key={slug}>
                <Link href={`/${encodeURIComponent(slug)}`} className="canvas-card">
                  <svg className="canvas-card-icon" width="18" height="18" viewBox="0 0 48 48" fill="none">
                    <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="2" />
                    <polygon points="24,2 44,14 24,18" fill="currentColor" opacity="0.5" />
                    <polygon points="24,18 4,34 24,46 44,34" fill="currentColor" opacity="0.3" />
                  </svg>
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
