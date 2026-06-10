# Shard

Publish your **Obsidian Canvas** and **Markdown** files directly to the web. Shard enables one-click publishing from Obsidian using Cloudflare R2 for content storage, Upstash Redis for permissions, and Next.js ISR (Incremental Static Regeneration) for instant page generation.

The published site is **view-only** — you edit in Obsidian and publish with a single click.

## How publishing works

1. **Local Development**: Drop files into `public/content/`. Works offline out-of-the-box using the local filesystem.
2. **Production / Deployed**: Click **Publish to Shard** inside Obsidian (via ribbon, right-click, or hotkey). The plugin automatically resolves referenced notes and attachments, uploads them directly to Cloudflare R2, and triggers an instant cache revalidation on Vercel.

## Deployed Architecture

- **Next.js (App Router)**: Renders canvases (using `@xyflow/react`) and standalone markdown pages with a premium dark-theme viewer.
- **Cloudflare R2**: Stores `.canvas`, `.md`, and attachment files. Zero egress fees for serving images.
- **Upstash Redis**: Tracks public vs. private visibility access control.
- **Obsidian Plugin**: Resolves dependency graphs, requests presigned upload URLs from the Shard backend, and performs direct uploads.

---

## Deploy to Vercel

1. **Push your Fork**: Fork and push this repository to GitHub.
2. **Setup Redis**: Create a free Redis instance on [Upstash](https://upstash.com).
3. **Setup Cloudflare R2**:
   - Create an R2 bucket in your Cloudflare dashboard (e.g., `shard-content`).
   - Add a custom domain or enable the public R2 `.dev` subdomain for the bucket.
   - Generate an API Token with "Edit" permissions to obtain an Access Key ID and Secret Access Key.
4. **Deploy on Vercel**:
   - Import your repository on Vercel.
   - Connect the Upstash integration (or manually add `KV_REST_API_URL` and `KV_REST_API_TOKEN`).
   - Configure the following environment variables:
     - `R2_ENDPOINT` (e.g., `https://<account-id>.r2.cloudflarestorage.com`)
     - `R2_ACCESS_KEY_ID`
     - `R2_SECRET_ACCESS_KEY`
     - `R2_BUCKET` (e.g., `shard-content`)
     - `R2_PUBLIC_URL` (the domain or `.dev` subdomain pointing to your bucket)
     - `SHARD_PUBLISH_KEY` (a random secure token for Obsidian plugin auth)
     - `AUTH_SECRET` (generate with `openssl rand -base64 32` for NextAuth)
     - `ALLOWED_EMAIL` (your email to log into the settings/admin dashboard)
     - `CREDENTIALS_PASSWORD_HASH` (generate with `node scripts/hash-password.mjs yourpassword`)

---

## Obsidian Plugin Setup

1. Copy the `packages/obsidian-plugin` folder to your vault's `.obsidian/plugins/` directory (rename the folder to `shard-publish`).
2. Run `npm install && npm run build` inside that folder to generate the compiled `main.js` and `styles.css`.
3. Enable the "Shard Publish" plugin in Obsidian's Community Plugins settings.
4. In the Shard settings panel:
   - **Shard URL**: Your deployed site URL (e.g., `https://your-shard-site.vercel.app`)
   - **API Key**: The `SHARD_PUBLISH_KEY` secret you set on Vercel.
5. Right-click any note or canvas and click **Publish to Shard**!

---

## Stack

Next.js (App Router) · React Flow (`@xyflow/react`) · Upstash Redis · Cloudflare R2 · react-markdown

