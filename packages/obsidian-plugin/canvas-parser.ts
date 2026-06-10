import { App, TFile } from "obsidian";

/**
 * Recursively scan a file (.canvas or .md) to find all referenced media, images, and notes.
 * Uses Obsidian's built-in metadataCache to resolve link paths correctly.
 */
export async function getDependencies(app: App, rootFile: TFile): Promise<TFile[]> {
  const dependencies: Set<TFile> = new Set();
  const visited: Set<string> = new Set();

  async function processFile(file: TFile) {
    const key = file.path;
    if (visited.has(key)) return;
    visited.add(key);

    if (file.path !== rootFile.path) {
      dependencies.add(file);
    }

    const ext = file.extension.toLowerCase();
    
    if (ext === "canvas") {
      try {
        const content = await app.vault.read(file);
        const canvas = JSON.parse(content);
        
        if (canvas.nodes && Array.isArray(canvas.nodes)) {
          for (const node of canvas.nodes) {
            if (node.type === "file" && typeof node.file === "string") {
              const linkedFile = app.metadataCache.getFirstLinkpathDest(node.file, file.path);
              if (linkedFile) {
                await processFile(linkedFile);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse canvas dependencies:", err);
      }
    } else if (ext === "md") {
      try {
        const content = await app.vault.read(file);
        
        // Match Wiki-style image/file embeds, e.g. ![[attachment.png]] or ![[image.jpg|300]]
        const wikiRegex = /!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
        let match;
        while ((match = wikiRegex.exec(content)) !== null) {
          const link = match[1].trim();
          const linkedFile = app.metadataCache.getFirstLinkpathDest(link, file.path);
          if (linkedFile) {
            await processFile(linkedFile);
          }
        }
        
        // Match Standard markdown image/file embeds, e.g. ![Alt](attachments/image.png)
        const mdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
        while ((match = mdRegex.exec(content)) !== null) {
          const link = decodeURIComponent(match[1].trim());
          if (/^https?:\/\//.test(link)) continue; // skip web URLs
          const linkedFile = app.metadataCache.getFirstLinkpathDest(link, file.path);
          if (linkedFile) {
            await processFile(linkedFile);
          }
        }
      } catch (err) {
        console.error("Failed to parse markdown dependencies:", err);
      }
    }
  }

  await processFile(rootFile);
  return Array.from(dependencies);
}
