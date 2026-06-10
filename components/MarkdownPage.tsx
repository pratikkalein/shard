import Link from "next/link";
import PublishButton from "./PublishButton";
import { Markdown } from "./nodes/Markdown";

interface MarkdownPageProps {
  title: string;
  slug: string;
  content: string;
}

export default function MarkdownPage({ title, slug, content }: MarkdownPageProps) {
  return (
    <div className="markdown-page-container">
      <div className="viewer-bar">
        <Link className="home-link" href="/">
          ← Shard
        </Link>
        <span className="viewer-title">{title}</span>
        <PublishButton slug={slug} />
      </div>
      <div className="markdown-page-content">
        <article className="markdown-page-article">
          <h1 className="title">{title}</h1>
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </div>
  );
}
