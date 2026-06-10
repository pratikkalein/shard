import { JSONCanvas } from "./types";
import { getLocalStorage } from "./storage-local";
import { getR2Storage } from "./storage-r2";

export interface ContentStorage {
  listCanvases(): Promise<string[]>;
  listMarkdown(): Promise<string[]>;
  readCanvas(slug: string): Promise<JSONCanvas | null>;
  readFile(path: string): Promise<string | null>;
  getPublicUrl(path: string): string;
  exists(path: string): Promise<boolean>;
}

export function getStorage(): ContentStorage {
  if (process.env.R2_ENDPOINT) {
    return getR2Storage();
  }
  return getLocalStorage();
}
