import { notFound } from "next/navigation";
import { getStorage } from "@/lib/storage";
import { buildViewModel } from "@/lib/resolveFiles";
import CanvasViewer from "@/components/CanvasViewer";
import MarkdownPage from "@/components/MarkdownPage";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const storage = getStorage();
  const [canvases, markdowns] = await Promise.all([
    storage.listCanvases(),
    storage.listMarkdown(),
  ]);
  const allSlugs = Array.from(new Set([...canvases, ...markdowns]));
  return allSlugs.map((slug) => ({ slug }));
}

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const storage = getStorage();

  // 1. Try to load as canvas
  const canvas = await storage.readCanvas(name);
  if (canvas) {
    const { nodes, edges } = await buildViewModel(canvas);
    return <CanvasViewer title={name} slug={name} nodes={nodes} edges={edges} />;
  }

  // 2. Try to load as standalone markdown
  const markdownContent = await storage.readFile(`${name}.md`);
  if (markdownContent !== null) {
    // Extract file basename for display title
    const displayTitle = name.substring(name.lastIndexOf("/") + 1);
    return <MarkdownPage title={displayTitle} slug={name} content={markdownContent} />;
  }

  notFound();
}
