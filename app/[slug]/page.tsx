import { notFound } from "next/navigation";
import { listCanvases, loadCanvas } from "@/lib/canvas";
import { buildViewModel } from "@/lib/resolveFiles";
import CanvasViewer from "@/components/CanvasViewer";

export const dynamicParams = false;

export function generateStaticParams() {
  return listCanvases().map((slug) => ({ slug }));
}

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const canvas = loadCanvas(name);
  if (!canvas) notFound();

  const { nodes, edges } = buildViewModel(canvas);
  return <CanvasViewer title={name} slug={name} nodes={nodes} edges={edges} />;
}
