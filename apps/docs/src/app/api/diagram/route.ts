import { promises as fs } from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BASE_DIR = path.resolve(process.cwd(), 'diagrams');
const LANG_MAP: Record<string, string> = {
  puml: 'plantuml',
  plantuml: 'plantuml',
  dot: 'graphviz',
  graphviz: 'graphviz',
  mermaid: 'mermaid',
  c4plantuml: 'c4plantuml',
};
const MAX_BYTES = 256 * 1024;
const MAX_URI_LENGTH = Number(process.env.KROKI_MAX_URI_LENGTH) || 4096;

export const revalidate = 3600;

const encode = async (str: string) => {
  const pako = await import('pako');

  const data = Buffer.from(str, 'utf8');

  const compressed = pako.deflate(data, { level: 9 });

  return Buffer.from(compressed).toString('base64').replaceAll('+', '-').replaceAll('/', '_');
};

const resolveIncludes = async (content: string, baseDir: string, includedFiles: Set<string> = new Set()): Promise<string> => {
  const includeRegex = /!include\s+(.+)$/gm;
  let resolved = content;
  let match;

  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1].trim();
    
    // Skip system includes (like !include <C4/C4_Container>)
    if (includePath.startsWith('<') && includePath.endsWith('>')) {
      console.log(`Skipping system include: ${includePath}`);
      continue;
    }
    
    const fullPath = path.resolve(baseDir, includePath);

    // Security check
    if (!fullPath.startsWith(BASE_DIR)) {
      throw new Error(`Include path outside allowlist: ${includePath}`);
    }

    // Check for circular includes
    if (includedFiles.has(fullPath)) {
      console.warn(`Circular include detected: ${includePath}, skipping`);
      resolved = resolved.replace(match[0], '');
      continue;
    }

    try {
      let includeContent = await fs.readFile(fullPath, 'utf8');
      
      // Add to included files set to prevent circular includes
      const newIncludedFiles = new Set(includedFiles);
      newIncludedFiles.add(fullPath);
      
      // Only remove @startuml and @enduml tags from included content
      // Keep other directives as they might be needed
      includeContent = includeContent.replace(/^@startuml\s*$/gm, '');
      includeContent = includeContent.replace(/^@enduml\s*$/gm, '');
      
      // Recursively resolve includes in the included file
      const resolvedInclude = await resolveIncludes(includeContent, path.dirname(fullPath), newIncludedFiles);
      resolved = resolved.replace(match[0], resolvedInclude);
      
      console.log(`Included ${includePath}, content length: ${resolvedInclude.length}`);
    } catch (error) {
      console.error(`Failed to include file: ${includePath}`, error);
      throw new Error(`Failed to include file: ${includePath}`);
    }
  }

  return resolved;
};

const handleRequest = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang')?.toLowerCase() ?? '';
    const relPath = searchParams.get('path') ?? '';
    let content = searchParams.get('content') ?? '';

    // For POST requests, read content from body
    if (req.method === 'POST' && !content) {
      content = await req.text();
    }

    const kind = LANG_MAP[lang];

    if (!kind) return NextResponse.json({ error: 'Unsupported lang' }, { status: 400 });

    let diagramContent: string;

    // If content is provided, use it directly; otherwise, read from file
    if (content) {
      diagramContent = content;
    } else if (relPath) {
      const abs = path.resolve(BASE_DIR, relPath);

      if (!abs.startsWith(BASE_DIR)) return NextResponse.json({ error: 'Path outside allowlist' }, { status: 400 });

      const data = await fs.readFile(abs, 'utf8');

      // Resolve !include directives only when reading from file
      diagramContent = await resolveIncludes(data, path.dirname(abs));
    } else {
      return NextResponse.json({ error: 'Either content or path must be provided' }, { status: 400 });
    }

    if (Buffer.byteLength(diagramContent) > MAX_BYTES) {
      return NextResponse.json({ error: 'Content too large' }, { status: 413 });
    }

    // For Mermaid diagrams, return the raw content to be rendered client-side
    if (kind === 'mermaid') {
      return new NextResponse(diagramContent, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    const krokiBase = process.env.KROKI_BASE_URL ?? 'http://kroki:8000';

    const encoded = await encode(diagramContent);
    const svgUrl = `${krokiBase}/${kind}/svg`
    const getUrl = `${svgUrl}/${encoded}`;

    let r: Response;
    if (getUrl.length <= MAX_URI_LENGTH) {
      r = await fetch(getUrl, {
        method: 'GET',
      });
    } else {
      r = await fetch(svgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: diagramContent,
      });
    }

    if (!r.ok) return NextResponse.json({ error: `Kroki failed: ${r.status}` }, { status: 502 });

    const svg = await r.text();

    return new NextResponse(svg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Diagram API error:', error);

    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
};

export const GET = handleRequest;
export const POST = handleRequest;
