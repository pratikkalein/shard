import type { CanvasColor, JSONCanvas, NodeBase, Side } from "./types";
import { getStorage } from "./storage";

export { CONTENT_DIR } from "./storage-local";

/** Slugs (filenames without extension) of every .canvas file in content. */
export async function listCanvases(): Promise<string[]> {
  return getStorage().listCanvases();
}

export async function loadCanvas(slug: string): Promise<JSONCanvas | null> {
  return getStorage().readCanvas(slug);
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
