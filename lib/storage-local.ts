import fs from "node:fs";
import path from "node:path";
import { JSONCanvas } from "./types";
import { ContentStorage } from "./storage";

export const CONTENT_DIR = path.join(process.cwd(), "public", "content");

function walkSync(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkSync(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

export class LocalStorage implements ContentStorage {
  async listCanvases(): Promise<string[]> {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.toLowerCase().endsWith(".canvas"))
      .map((f) => f.slice(0, -".canvas".length))
      .sort((a, b) => a.localeCompare(b));
  }

  async listMarkdown(): Promise<string[]> {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const allFiles = walkSync(CONTENT_DIR);
    return allFiles
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .map((f) => {
        const relative = path.relative(CONTENT_DIR, f);
        // remove extension
        return relative.slice(0, -".md".length);
      })
      .sort((a, b) => a.localeCompare(b));
  }

  async readCanvas(slug: string): Promise<JSONCanvas | null> {
    const file = path.join(CONTENT_DIR, `${slug}.canvas`);
    if (!fs.existsSync(file)) return null;
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")) as JSONCanvas;
    } catch {
      return null;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    const file = path.join(CONTENT_DIR, filePath);
    if (!fs.existsSync(file)) return null;
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      return null;
    }
  }

  getPublicUrl(filePath: string): string {
    return "/content/" + filePath.split("/").map(encodeURIComponent).join("/");
  }

  async exists(filePath: string): Promise<boolean> {
    const file = path.join(CONTENT_DIR, filePath);
    return fs.existsSync(file);
  }
}

let localStorageInstance: LocalStorage | null = null;

export function getLocalStorage(): ContentStorage {
  if (!localStorageInstance) {
    localStorageInstance = new LocalStorage();
  }
  return localStorageInstance;
}
