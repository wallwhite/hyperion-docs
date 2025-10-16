# Hyperion Docs

> Developer-first documentation stack with diagrams-as-code

A two-service monorepo combining **Fumadocs v15** (Next.js) for beautiful MDX documentation with **Kroki** for rendering diagrams from code. Built for developer experience with one-command setup and hot reload in Docker.

## Features

- 🎨 **Dark/Light Theme Support** - All diagrams adapt automatically
- 🔍 **Zoomable Diagrams** - Click any diagram to open in fullscreen with pan/zoom
- 🚀 **Hot Reload** - Edit MDX or components, see changes instantly
- 🔒 **Secure by Default** - Path traversal protection, size limits, language allowlist
- 📦 **One Command** - `./scripts/dev.sh` starts everything or if you have Node.js installed you can run `pnpm dev`
- 🎯 **Type-Safe** - TypeScript strict mode throughout

## Tech Stack

- **Node.js 22** with **pnpm**
- **Next.js 15** App Router
- **Fumadocs v15** for documentation UI
- **Kroki** for diagram rendering
- **Mermaid** for inline diagrams
- **React Flow** for zoomable viewer
- **TailwindCSS 3** for styling
- **Docker** & **Docker Compose** for containerization

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Docker & Docker Compose v2

### Installation

```bash
# Clone the repository
git clone https://github.com/wallwhite/hyperion-docs.git

# Navigate to the project directory
cd hyperion-docs

# Install dependencies
pnpm install

# Start both services (docs + kroki)
pnpm dev
```

Visit **http://localhost:3000** - changes hot-reload automatically!

### Stop Services

```bash
# Stop both services (docs + kroki)
pnpm stop

# or use the script
./scripts/stop.sh
```

## Project Structure

```
hyperion-docs/
├── apps/
│   └── docs/                    # Next.js + Fumadocs app
│       ├── app/                 # Next.js App Router
│       │   ├── api/diagram/     # Diagram proxy API
│       │   ├── docs/            # Docs routes
│       │   ├── layout.tsx       # Root layout
│       │   └── page.tsx         # Home page
│       ├── components/          # React components
│       ├── content/docs/        # MDX documentation
│       ├── diagrams/            # Diagram source files (.puml, .dot)
│       ├── openapi/             # OpenAPI schema files (.yaml)
│       ├── lib/                 # Utilities
│       ├── mdx-components.tsx   # MDX component config
│       ├── source.config.ts     # Fumadocs source config
│       └── Dockerfile           # Docs service Dockerfile
├── docker-compose.yml           # Services orchestration
├── pnpm-workspace.yaml          # Monorepo config
└── package.json                 # Root scripts
```

## Usage

### Inline Mermaid Diagrams

```mdx
<Diagram lang="mermaid" chart="
graph TD;
  A[Client] --> B[Server];
  B --> C[Database];" />
```

### External Diagrams (PlantUML, Graphviz, etc.)

Place your diagram files in `apps/docs/diagrams/`:

```mdx
<Diagram lang="plantuml" path="erd.puml" alt="Entity Relationship Diagram" />
<Diagram lang="graphviz" path="flow.dot" alt="Processing Flow" />
```

### Supported Languages

- **PlantUML** - `puml`, `plantuml`
- **Graphviz** - `dot`, `graphviz`
- **Mermaid** - `mermaid` (or use `<Mermaid>` component)
- **C4 PlantUML** - `c4plantuml`

Easily extend by adding to `LANG_MAP` in `apps/docs/app/api/diagram/route.ts`.

## Architecture

### Flow

```
MDX File → <Diagram> Component → /api/diagram API Route → Kroki Service → SVG/PNG Response
```

### API Route (`/api/diagram`)

- **Runtime**: `nodejs` (required for `fs` access)
- **Security**: Path allowlist, size limits, language validation
- **Caching**: `Cache-Control: no-store` in dev

**Query Parameters**:
- `lang` - Diagram language (e.g., `puml`, `dot`)
- `path` - Relative path to diagram file
- `fmt` - Output format (`svg` or `png`, default: `svg`)

### Components


#### `<Diagram>`
- Fetches from `/api/diagram` or generates Mermaid diagrams directly from the chart string
- Opens modal on click
- Supports SVG

#### `<PreviewModal>`
- Whiteboard canvas
- Pan, zoom, reset controls

## Development

### Local Development (without Docker)

```bash
cd apps/docs
pnpm install
pnpm dev
```

> **Note**: You'll need to run Kroki separately or set `KROKI_BASE_URL` to a public instance.

### Adding New Diagram Types

1. Add language mapping to `apps/docs/app/api/diagram/route.ts`:
   ```ts
   const LANG_MAP: Record<string, string> = {
     // ...existing
     d2: 'd2',  // Add new type
   };
   ```

2. Create diagram files in `apps/docs/diagrams/`

3. Use in MDX:
   ```mdx
   <Diagram lang="d2" path="my-diagram.d2" />
   ```

### Customizing Styles

Edit `apps/docs/tailwind.config.ts` to customize Tailwind or override Fumadocs styles.

## Security

- **Path Traversal**: All paths resolved relative to `apps/docs/diagrams` and validated
- **File Size**: Max 256 KB per diagram file
- **Language Allowlist**: Only mapped languages accepted
- **No Code Execution**: Diagrams treated as opaque text sent to Kroki


## Troubleshooting

### Diagrams not rendering

1. Check Kroki is running
2. Verify diagram file path is relative to `apps/docs/diagrams`
3. Check browser console for API errors
4. Confirm language is in `LANG_MAP`

### TypeScript errors

```bash
cd apps/docs
pnpm typecheck
```

## License

MIT

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using Fumadocs, Next.js, and Kroki
