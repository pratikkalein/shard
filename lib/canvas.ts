import fs from "node:fs";
import path from "node:path";
import type { CanvasColor, JSONCanvas, NodeBase, Side } from "./types";

// All published content lives here so that referenced images are also
// served as static assets (e.g. /content/attachments/diagram.svg).
export const CONTENT_DIR = path.join(process.cwd(), "public", "content");

/** Slugs (filenames without extension) of every .canvas file in content. */
export function listCanvases(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.toLowerCase().endsWith(".canvas"))
    .map((f) => f.slice(0, -".canvas".length))
    .sort((a, b) => a.localeCompare(b));
}

export function loadCanvas(slug: string): JSONCanvas | null {
  const file = path.join(CONTENT_DIR, `${slug}.canvas`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as JSONCanvas;
  } catch {
    return null;
  }
}

// Obsidian's six canvas colour presets.
const PRESET_COLORS: Record<string, string> = {
  "1": "#fb464c", // red
  "2": "#e9973f", // orange
  "3": "#e0de71", // yellow
  "4": "#44cf6e", // green
  "5": "#53dfdd", // cyan
  "6": "#a882ff", // purple
};

export function resolveColor(color?: CanvasColor): string | undefined {
  if (!color) return undefined;
  return PRESET_COLORS[color] ?? color;
}

/** Pick connection sides for an edge when fromSide/toSide are not specified. */
export function nearestSides(
  from: NodeBase,
  to: NodeBase,
): { fromSide: Side; toSide: Side } {
  const dx = to.x + to.width / 2 - (from.x + from.width / 2);
  const dy = to.y + to.height / 2 - (from.y + from.height / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { fromSide: "right", toSide: "left" }
      : { fromSide: "left", toSide: "right" };
  }
  return dy >= 0
    ? { fromSide: "bottom", toSide: "top" }
    : { fromSide: "top", toSide: "bottom" };
}
