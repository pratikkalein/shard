"use client";

import { useEffect, useState } from "react";

interface Status {
  isPublic: boolean;
  isOwner: boolean;
}

export default function PublishButton({ slug }: { slug: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/canvas/${encodeURIComponent(slug)}/status`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [slug]);

  if (!status?.isOwner) return null;

  async function toggle() {
    if (!status) return;
    setLoading(true);
    const next = !status.isPublic;
    try {
      await fetch("/api/admin/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, public: next }),
      });
      setStatus({ ...status, isPublic: next });
    } finally {
      setLoading(false);
    }
  }

  const pub = status.isPublic;
  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`publish-btn ${pub ? "publish-btn-public" : "publish-btn-private"}`}
      title={pub ? "Click to make private" : "Click to publish publicly"}
    >
      {loading ? (
        <span className="publish-spinner" />
      ) : pub ? (
        <>
          <GlobeIcon />
          <span>Public</span>
        </>
      ) : (
        <>
          <LockIcon />
          <span>Private</span>
        </>
      )}
    </button>
  );
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
