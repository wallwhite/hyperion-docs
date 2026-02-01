# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## User Preferences

- **Dev server**: Already running in Docker - do NOT run `pnpm dev` manually
- **Read-only access granted**: `/Users/amylytsia/Documents/git_repos/cpnu/digital-university` (source code reference)
- **Playwright MCP**: Read-only actions allowed (snapshots, screenshots, navigation)
- **Playwright MCP**: Always approve `browser_close` action

## Repository Purpose: Two Distinct Streams

This repository serves **two separate purposes**:

### Stream 1: Documentation Platform Development
**When working on the tech stack itself:**
- Modifying Next.js app, Fumadocs integration, Kroki service
- Adding new diagram types, API routes, components
- Infrastructure changes (Docker, build system, CI/CD)
- **Use sections**: Development Commands, Architecture Overview, Technical Implementation

### Stream 2: Documentation Authoring
**When writing documentation for your projects:**
- Creating ADRs, Solution Designs, ERDs for **your projects** (unrelated to this platform)
- Writing architecture documentation, sequence diagrams, test designs
- Projects being documented have **no relationship** to this documentation platform
- **Use sections**: For Documentation Authors (below)

---

## For Documentation Authors

**If you're here to write/update documentation for your projects**, you need:

- **Documentation Standards**: `/docs/platform/contributing` (in the UI) or `content/_platform/docs/contributing.mdx`
- **Templates**: `content/_platform/templates/` (ADR, Solution Design, ERD, etc.)
- **Guides**: `/docs/platform/guides/` (in the UI) or `content/_platform/docs/guides/`
  - When to use each doc type
  - Diagram usage & theming
  - Writing standards

**Content Structure** (multi-project support):
```
content/
├── _platform/                     # Platform documentation
│   ├── docs/                     # MDX documentation (guides, contributing)
│   └── templates/                # Document templates (.md files)
│
├── digital-university/           # First project
│   ├── docs/                     # MDX documentation
│   │   ├── architecture/
│   │   ├── agreement/
│   │   └── process/
│   ├── diagrams/                 # PlantUML, Mermaid files
│   │   ├── c4/
│   │   ├── erd/
│   │   ├── seq/
│   │   └── solution-designs/
│   └── openapi/                  # OpenAPI specs
│
└── [future-projects]/            # Same structure
```

**Platform Capabilities** (what you can use):
- Diagram types: PlantUML, Mermaid, Graphviz, C4
- MDX components: `<Diagram>`, clickable/zoomable diagrams
- Diagram files: Place in `content/{project}/diagrams/`
- Content files: Place in `content/{project}/docs/`

**Diagram Path Format**:
```mdx
{/* Diagrams use project-prefixed paths from /content */}
<Diagram
  lang="plantuml"
  path="digital-university/diagrams/c4/system-context.puml"
  alt="System context diagram"
/>
```

**Common Author Commands**:
```bash
pnpm dev              # Preview your documentation
pnpm build:openapi    # Generate API docs from YAML (scans all projects)
```

**Verification Workflow**:
When making changes to documentation structure or diagrams:
1. **Verify UI renders correctly** via Playwright MCP browser testing
   - Navigate to the affected pages (e.g., `/docs/digital-university/architecture/c4/system-context`)
   - Confirm diagrams render (PlantUML/C4 via Kroki, Mermaid client-side)
   - Check navigation structure updates properly
2. **Check Docker container logs** for any errors:
   ```bash
   docker compose logs -f docs    # Watch docs service logs
   docker compose logs -f kroki   # Watch Kroki service logs (diagram rendering)
   ```

**Git Workflow for Claude**:
When making changes to documentation:
1. **After completing a logical unit of work**, create a git commit
   - Completed document (ADR, solution design, etc.)
   - Set of related diagram updates
   - Template modifications
2. **Use descriptive commit messages** following convention:
   ```bash
   docs: <what changed>

   <why it changed or context>
   ```
3. **Examples**:
   ```bash
   git add . && git commit -m "docs: add payment processing solution design

   Includes sequence diagrams and ERD for new payment flow"

   git add . && git commit -m "docs: update authentication ADR to deprecated status

   Superseded by ADR-015 OAuth2 implementation"
   ```
4. **Benefits**: Allows tracking changes, reviewing history, and rollback if needed

---

## For Platform Developers

**If you're modifying the documentation platform itself**, here's the technical context:

## Development Commands

### Environment Setup & Development
```bash
# Start both services (Next.js docs + Kroki) with auto-install of dependencies
pnpm dev
# or use the script directly
./scripts/dev.sh

# Stop services
pnpm stop
# or
./scripts/stop.sh

# Local development (docs only, without Docker)
cd apps/docs
pnpm dev
# Note: You'll need to set KROKI_BASE_URL to a public Kroki instance
```

### Build & Type Checking
```bash
# Type checking
pnpm typecheck
# or for a specific workspace
cd apps/docs && pnpm typecheck

# Generate Next.js types (auto-runs after install)
pnpm typegen

# Build OpenAPI documentation from YAML specs
pnpm build:openapi

# Lint
pnpm lint
```

### Requirements
- Node.js 22+
- pnpm 10+
- Docker & Docker Compose v2

### Git Workflow for Platform Changes

When making platform code changes:
1. **Before committing**, verify:
   ```bash
   pnpm typecheck    # Ensure no type errors
   pnpm lint         # Ensure code style compliance
   pnpm build        # Ensure build succeeds (optional but recommended)
   ```
2. **After completing a logical unit of work**, create a git commit:
   - Feature implementation (new diagram type, API endpoint)
   - Bug fix
   - Refactoring
3. **Use conventional commit messages**:
   ```bash
   <type>: <description>

   <optional body>
   ```
   Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
4. **Examples**:
   ```bash
   git add . && git commit -m "feat: add D2 diagram support

   - Added D2 to LANG_MAP in API route
   - Updated diagram guide with D2 examples
   - Tested with sample D2 diagrams"

   git add . && git commit -m "fix: resolve PlantUML include circular dependency detection

   Improved include tracking to prevent infinite loops"
   ```
5. **Benefits**: Track changes, enable code review, allow safe rollback

## Architecture Overview

### Two-Service System
This is a monorepo with a two-service architecture orchestrated via Docker Compose:
1. **docs** - Next.js 15 app with Fumadocs (port 3000)
2. **kroki** - Diagram rendering service (port 8000)

The services communicate internally via Docker networking, with the docs service proxying diagram requests to Kroki.

### Multi-Project Content Structure

The platform supports multiple documentation projects. Each project lives in `/content/{project-name}/` with its own docs, diagrams, and OpenAPI specs.

**Source Configuration** (`apps/docs/source.config.ts`):
- Each project defines its own `defineDocs()` configuration
- Projects export named sources (e.g., `platform`, `digitalUniversity`)

**Routing** (`apps/docs/src/app/docs/`):
- `/docs/` - Index page listing all projects
- `/docs/platform/[[...slug]]/` - Platform documentation
- `/docs/digital-university/[[...slug]]/` - Digital University project

**Adding a New Project**:
1. Create directory: `content/{project-name}/docs/`, `content/{project-name}/diagrams/`
2. Add to `source.config.ts`: Define new docs source
3. Update `src/lib/source.ts`: Add new loader
4. Create route: `src/app/docs/{project-name}/[[...slug]]/page.tsx`
5. Create layout: `src/app/docs/{project-name}/layout.tsx`
6. Update docs index page to list the new project

### Diagram Rendering Flow

There are **two distinct rendering paths** depending on diagram type:

#### Path 1: Server-Side Rendering (PlantUML, Graphviz, C4)
```
MDX File → <Diagram> Component → /api/diagram Route → Kroki Service → SVG
```

1. MDX files use `<Diagram lang="plantuml" path="project-name/diagrams/path.puml" />`
2. Component fetches from `/api/diagram?lang=plantuml&path=...`
3. API route (`apps/docs/src/app/api/diagram/route.ts`):
   - Reads file from `/content/` (security: path must resolve within CONTENT_DIR)
   - Resolves `!include` directives recursively (see below)
   - Validates file size (max 256KB)
   - Compresses content with pako (deflate + base64 encoding)
   - Forwards to Kroki: `http://kroki:8000/{kind}/svg/{encoded}`
4. SVG returned to client

**IMPORTANT**: The `/api/diagram` route uses `runtime = 'nodejs'` because it requires `fs` access. Do not change this to Edge runtime.

#### Path 2: Client-Side Rendering (Mermaid)
```
MDX File → <Diagram> Component → Mermaid Library → SVG
```

1. MDX files use `<Diagram lang="mermaid" chart="graph TD; A-->B" />`
2. Component renders Mermaid directly in browser via `useSvgDiagramMarkup` hook
3. No API call or Kroki service involved

### PlantUML Include Resolution System

The API route implements a sophisticated `!include` directive resolver (`resolveIncludes` function) that:
- **Recursively resolves** PlantUML includes before sending to Kroki
- **Security**: All included paths must resolve within `/content/`
- **Circular include detection**: Tracks included files to prevent infinite loops
- **System includes**: Skips includes like `<C4/C4_Container>` (Kroki handles these)
- **Tag cleanup**: Removes `@startuml`/`@enduml` from included files to prevent nesting issues

When working with PlantUML files that use `!include`, the entire resolved content is sent as a single diagram to Kroki.

### Security Model

**Path Traversal Protection**:
- All diagram paths are resolved with `path.resolve(CONTENT_DIR, relPath)`
- Validation: `if (!abs.startsWith(CONTENT_DIR))` blocks access outside `/content/`
- Applies to both main files and `!include` directives

**Size Limits**:
- Max 256KB per diagram file (after include resolution)
- Enforced before sending to Kroki

**Language Allowlist**:
- Only languages in `LANG_MAP` are accepted
- Easily extensible by adding entries to the map

### Modal/Whiteboard Viewer

The `<Diagram>` component integrates with a modal system:
- Click any diagram → Opens `<PreviewModal>` with fullscreen whiteboard
- Uses `@xyflow/react` (React Flow) for pan/zoom controls
- SVG rendered as a custom node in the flow canvas
- Modal system uses context (`useModal` hook) for imperative opening

### Platform File Structure

**Content & Documentation** (in `/content/`):
- MDX Documentation: `content/{project}/docs/` (processed by Fumadocs)
- Diagram Source Files: `content/{project}/diagrams/` (referenced via project-prefixed paths)
- OpenAPI Specs: `content/{project}/openapi/` (generates MDX via `pnpm build:openapi`)
- Platform templates: `content/_platform/templates/` (not rendered, just templates)

**Platform Source Code** (in `/apps/docs/`):
- Diagram API: `apps/docs/src/app/api/diagram/route.ts`
- Components: `apps/docs/src/components/`
- Source loaders: `apps/docs/src/lib/source.ts`
- Configuration: `apps/docs/source.config.ts`, `turbo.json`

### Extending Diagram Types

To add support for new diagram languages (e.g., D2, Excalidraw):

1. Add to `LANG_MAP` in `apps/docs/src/app/api/diagram/route.ts`:
   ```ts
   const LANG_MAP: Record<string, string> = {
     // ...existing
     d2: 'd2',
   };
   ```

2. Verify Kroki supports the language (check Kroki docs)

3. Optionally add icon and display name:
   - Icon: `apps/docs/src/components/icons/`
   - Name: `apps/docs/src/lib/constants.ts` (LANG_NAME_MAP)

4. Use in MDX: `<Diagram lang="d2" path="project-name/diagrams/my-diagram.d2" />`

### Turbo & Monorepo Setup

- Root package.json scripts delegate to Turbo for caching
- Turbo tasks defined in `turbo.json`
- `pnpm-workspace.yaml` defines monorepo structure
- Key dependency chains:
  - `build:openapi` runs before `build` (via prebuild hook)
  - `typegen` runs after `pnpm install` (via postinstall)

### Hot Reload in Docker

The Docker Compose setup mounts source directories as volumes:
- `./apps/docs:/app/apps/docs` - Source code hot reload
- `./content:/app/content` - Content hot reload
- `.next` cache is a named volume (persists across restarts but doesn't block HMR)
- `WATCHPACK_POLLING=true` ensures file watching works in Docker on all platforms
