# Shard

Publish your **Obsidian Canvas** files to the web. Drop a `.canvas` file into the
repo, push, and Vercel builds a static, interactive (pan & zoom) viewer — one page
per canvas. Built on the open [JSON Canvas](https://jsoncanvas.org) format.

The published site is **view-only** — you edit in Obsidian; the web just renders.

## How publishing works

1. Put your files in `public/content/`:

   ```
   public/content/
     my-diagram.canvas          # → published at /my-diagram
     notes/some-note.md         # a note referenced by a file node
     attachments/picture.png    # an image referenced by a file node
   ```

   Keep the **same relative paths** that the canvas uses inside your vault, so that
   `file` nodes resolve. Markdown notes are rendered; images are displayed; other
   files become a download link.

2. Commit and push. Vercel rebuilds and the canvas is live at
   `https://<your-site>.vercel.app/my-diagram`.

The home page (`/`) lists every canvas in `public/content/`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

The included `welcome.canvas` demonstrates text, file (note + image), link, and
group nodes plus edges. Replace it with your own.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repo. Framework (Next.js) is
   auto-detected — no configuration needed.
3. Deploy. Future pushes redeploy automatically.

```bash
npm run build    # optional: verify the production build locally
```

## How it maps the spec

| JSON Canvas              | Rendered as                                            |
| ------------------------ | ------------------------------------------------------ |
| `text` node              | Markdown (GFM)                                          |
| `file` node (`.md`)      | Embedded note (honors `#heading` subpath)              |
| `file` node (image)      | `<img>`                                                |
| `link` node              | Favicon + live `<iframe>` embed                        |
| `group` node             | Labelled background rectangle (optional bg image)      |
| `edge`                   | Bezier connector with arrowheads, side handles, label  |
| `color` (`"1"`–`"6"`/hex)| Obsidian preset palette / raw hex on borders & strokes |

## Stack

Next.js (App Router) · React Flow (`@xyflow/react`) · react-markdown — all
statically generated, deployable on Vercel's free tier.
