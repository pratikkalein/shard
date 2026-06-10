---
type: "query"
date: "2026-06-04T12:35:53.071429+00:00"
question: "Why does CanvasPage connect Canvas Data Loading & Slug Resolution to Canvas Viewer UI & Types, Publish Settings & Redis Integration?"
contributor: "graphify"
source_nodes: ["CanvasPage", "CanvasViewer", "PublishButton"]
---

# Q: Why does CanvasPage connect Canvas Data Loading & Slug Resolution to Canvas Viewer UI & Types, Publish Settings & Redis Integration?

## Answer

The CanvasPage component in app/[slug]/page.tsx (Canvas Data Loading & Slug Resolution, Community 1) serves as the page entry point that loads canvas details. It resolves the canvas slug, loads the raw canvas data, builds the view model, and passes it to CanvasViewer (Canvas Viewer UI & Types, Community 0) for rendering. CanvasViewer rendering includes rendering custom xyflow nodes (TextNode, LinkNode, FileNode, GroupNode) and a PublishButton. The PublishButton in components/PublishButton.tsx makes network requests to GET /api/canvas/[slug]/status and POST /api/admin/toggle (Publish Settings & Redis Integration, Community 2) to fetch status and toggles public settings via Upstash Redis KV backend.

## Source Nodes

- CanvasPage
- CanvasViewer
- PublishButton