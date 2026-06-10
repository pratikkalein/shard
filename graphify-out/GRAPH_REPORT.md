# Graph Report - .  (2026-06-04)

## Corpus Check
- Corpus is ~25,777 words - fits in a single context window. You may not need a graph.

## Summary
- 181 nodes · 291 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Canvas Viewer UI & Types|Canvas Viewer UI & Types]]
- [[_COMMUNITY_Canvas Data Loading & Slug Resolution|Canvas Data Loading & Slug Resolution]]
- [[_COMMUNITY_Publish Settings & Redis Integration|Publish Settings & Redis Integration]]
- [[_COMMUNITY_Project Dependencies & Packages|Project Dependencies & Packages]]
- [[_COMMUNITY_TypeScript Config Settings|TypeScript Config Settings]]
- [[_COMMUNITY_User Authentication UI & Login Flows|User Authentication UI & Login Flows]]
- [[_COMMUNITY_Onboarding Personal Info UI Screenshots|Onboarding Personal Info UI Screenshots]]
- [[_COMMUNITY_Publish Button Component & State|Publish Button Component & State]]
- [[_COMMUNITY_Corporate Branding & Wizard Form|Corporate Branding & Wizard Form]]
- [[_COMMUNITY_NextAuth API Route Handlers|NextAuth API Route Handlers]]
- [[_COMMUNITY_Onboarding Employment History Form|Onboarding Employment History Form]]
- [[_COMMUNITY_Next.js Root Layout & Metadata|Next.js Root Layout & Metadata]]
- [[_COMMUNITY_Obsidian Canvas Architecture Diagram|Obsidian Canvas Architecture Diagram]]
- [[_COMMUNITY_Local Claude Settings Permissions|Local Claude Settings Permissions]]
- [[_COMMUNITY_Obsidian Canvas Markdown Formats|Obsidian Canvas Markdown Formats]]
- [[_COMMUNITY_NextAuth Type Declarations|NextAuth Type Declarations]]
- [[_COMMUNITY_Next.js Build Configuration|Next.js Build Configuration]]
- [[_COMMUNITY_Next.js Route Dynamic Config|Next.js Route Dynamic Config]]
- [[_COMMUNITY_KV Database Storage Constants|KV Database Storage Constants]]
- [[_COMMUNITY_NextAuth API Exports|NextAuth API Exports]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `buildViewModel()` - 11 edges
3. `SideHandles()` - 10 edges
4. `listCanvases()` - 9 edges
5. `CanvasViewer()` - 8 edges
6. `auth` - 7 edges
7. `AdminPage()` - 6 edges
8. `loadCanvas()` - 6 edges
9. `isPublic()` - 6 edges
10. `setPublic()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `CanvasViewer()` --implements--> `Static Canvas Viewer`  [INFERRED]
  components/CanvasViewer.tsx → README.md
- `buildViewModel()` --implements--> `File Node Resolution`  [INFERRED]
  lib/resolveFiles.ts → README.md
- `Claude Settings Permissions` --conceptually_related_to--> `loadCanvas()`  [INFERRED]
  .claude/settings.local.json → lib/canvas.ts
- `generateStaticParams()` --calls--> `listCanvases()`  [EXTRACTED]
  app/[slug]/page.tsx → lib/canvas.ts
- `AdminPage()` --calls--> `listCanvases()`  [EXTRACTED]
  app/admin/page.tsx → lib/canvas.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Authentication Flow** — login_page_loginpage, login_loginform_loginform, login_actions_signinwithgoogle, login_actions_signinwithcredentials [INFERRED 0.95]
- **Canvas Publish Management** — admin_page_adminpage, admin_page_toggle, toggle_route_post, status_route_get [INFERRED 0.95]
- **Canvas Node Renderers** — nodes_filenode_filenode, nodes_groupnode_groupnode, nodes_linknode_linknode, nodes_textnode_textnode [INFERRED 0.95]
- **Canvas Content Resolution Flow** — lib_canvas_content_dir, lib_resolvefiles_resolvefilenode, lib_resolvefiles_buildviewmodel [INFERRED 0.95]
- **Onboarding UI Components Group** — screenshot_2026_06_02_at_6_24_40_pm_2_wizard, screenshot_2026_06_02_at_6_24_40_pm_2_personal_info_form, screenshot_2026_06_02_at_6_24_40_pm_2_employee_card, screenshot_2026_06_02_at_6_24_40_pm_2_branding [INFERRED 0.85]

## Communities (20 total, 8 thin omitted)

### Community 0 - "Canvas Viewer UI & Types"
Cohesion: 0.11
Nodes (29): CanvasViewer(), nodeTypes, Arrow, CanvasColor, CanvasEdge, CanvasNode, FileNode, GroupData (+21 more)

### Community 1 - "Canvas Data Loading & Slug Resolution"
Cohesion: 0.18
Nodes (20): Claude Settings Permissions, CanvasPage, generateStaticParams, Home(), CONTENT_DIR, listCanvases(), loadCanvas(), nearestSides() (+12 more)

### Community 2 - "Publish Settings & Redis Integration"
Cohesion: 0.19
Nodes (17): AdminPage(), toggle, auth, authConfig, { handlers, auth, signIn, signOut }, base(), isPublic(), isRedisConfigured() (+9 more)

### Community 3 - "Project Dependencies & Packages"
Cohesion: 0.08
Nodes (23): dependencies, bcryptjs, next, next-auth, react, react-dom, react-markdown, remark-gfm (+15 more)

### Community 4 - "TypeScript Config Settings"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "User Authentication UI & Login Flows"
Cohesion: 0.44
Nodes (6): signIn, signInWithCredentials(), signInWithGoogle(), GoogleIcon(), LoginForm(), LoginPage()

### Community 6 - "Onboarding Personal Info UI Screenshots"
Cohesion: 0.40
Nodes (6): Impulsive Web User Profile Screenshot, Impulsive Web Portal Interface, Information Directory Sidebar, Personal Information Summary Grid, Employee Profile Summary Header, Progressive Information Collection Design Pattern

### Community 7 - "Publish Button Component & State"
Cohesion: 0.60
Nodes (4): GlobeIcon(), LockIcon(), PublishButton(), Status

### Community 8 - "Corporate Branding & Wizard Form"
Cohesion: 0.50
Nodes (5): Impulsive Web Corporate Branding, Employee Profile Summary Header Card, Screenshot: Impulsive Web Onboarding Portal, Personal Information Form Layout, greytHR Onboarding Wizard Flow

### Community 9 - "NextAuth API Route Handlers"
Cohesion: 0.50
Nodes (3): GET, POST, handlers

### Community 10 - "Onboarding Employment History Form"
Cohesion: 0.67
Nodes (4): Static Profile Summary Card, Screenshot - Onboarding Wizard Previous Employment, Multi-Step Onboarding Wizard Pattern, Previous Employment Dynamic Form Layout

### Community 14 - "Obsidian Canvas Markdown Formats"
Cohesion: 0.67
Nodes (3): Embedded Note Document, File Node Resolution, Obsidian Canvas Format

## Knowledge Gaps
- **66 isolated node(s):** `allow`, `metadata`, `nodeTypes`, `Status`, `BG_SIZE` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanvasViewer()` connect `Canvas Viewer UI & Types` to `Canvas Data Loading & Slug Resolution`, `Publish Button Component & State`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `CanvasPage` connect `Canvas Data Loading & Slug Resolution` to `Canvas Viewer UI & Types`, `Publish Settings & Redis Integration`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `listCanvases()` connect `Canvas Data Loading & Slug Resolution` to `Publish Settings & Redis Integration`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `allow`, `metadata`, `nodeTypes` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Canvas Viewer UI & Types` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._