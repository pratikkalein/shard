import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, nearestSides, resolveColor } from "./canvas";
import type {
  JSONCanvas,
  ResolvedFile,
  Side,
  ViewEdge,
  ViewModel,
  ViewNode,
} from "./types";

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".avif",
]);

/** Turn a vault-relative path into a public URL under /content. */
function toContentUrl(file: string): string {
  return "/content/" + file.split("/").map(encodeURIComponent).join("/");
}

/** Resolve a file node into renderable data at build time. */
function resolveFileNode(file: string, subpath?: string): ResolvedFile {
  const ext = path.extname(file).toLowerCase();

  if (ext === ".md") {
    const abs = path.join(CONTENT_DIR, file);
    let content = fs.existsSync(abs)
      ? fs.readFileSync(abs, "utf8")
      : `> ⚠️ Missing file: \`${file}\`\n>\n> Copy it into \`public/content/${file}\`.`;
    if (subpath) content = extractSubpath(content, subpath);
    return { kind: "markdown", content, file };
  }

  const src = toContentUrl(file);
  if (IMAGE_EXT.has(ext)) return { kind: "image", src, file };
  return { kind: "other", src, file };
}

/** Slice a markdown document down to a single "#heading" section. */
function extractSubpath(md: string, subpath: string): string {
  const heading = subpath.replace(/^#+/, "").trim().toLowerCase();
  if (!heading) return md;
  const lines = md.split("\n");
  const isHeading = (l: string) => /^#{1,6}\s+/.test(l);
  const level = (l: string) => (l.match(/^#+/)?.[0].length ?? 0);
  const start = lines.findIndex(
    (l) =>
      isHeading(l) &&
      l.replace(/^#{1,6}\s+/, "").trim().toLowerCase() === heading,
  );
  if (start === -1) return md;
  const startLevel = level(lines[start]);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (isHeading(lines[i]) && level(lines[i]) <= startLevel) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

/** Build the serializable view model consumed by the client viewer. */
export function buildViewModel(canvas: JSONCanvas): ViewModel {
  const nodes = canvas.nodes ?? [];
  const edges = canvas.edges ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const viewNodes: ViewNode[] = nodes.map((n) => {
    const base = {
      id: n.id,
      type: n.type,
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
      color: resolveColor(n.color),
    };
    switch (n.type) {
      case "text":
        return { ...base, data: { text: n.text } };
      case "link":
        return { ...base, data: { url: n.url } };
      case "group":
        return {
          ...base,
          data: {
            label: n.label,
            background: n.background ? toContentUrl(n.background) : undefined,
            backgroundStyle: n.backgroundStyle,
          },
        };
      case "file":
        return { ...base, data: resolveFileNode(n.file, n.subpath) };
    }
  });

  const viewEdges: ViewEdge[] = edges.map((e) => {
    const from = byId.get(e.fromNode);
    const to = byId.get(e.toNode);
    let fromSide = e.fromSide;
    let toSide = e.toSide;
    if ((!fromSide || !toSide) && from && to) {
      const ns = nearestSides(from, to);
      fromSide = fromSide ?? ns.fromSide;
      toSide = toSide ?? ns.toSide;
    }
    return {
      id: e.id,
      source: e.fromNode,
      target: e.toNode,
      sourceHandle: (fromSide ?? "right") as Side,
      targetHandle: (toSide ?? "left") as Side,
      markerStart: e.fromEnd === "arrow",
      markerEnd: (e.toEnd ?? "arrow") === "arrow",
      color: resolveColor(e.color),
      label: e.label,
    };
  });

  return { nodes: viewNodes, edges: viewEdges };
}
