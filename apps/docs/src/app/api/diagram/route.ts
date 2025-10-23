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

export const revalidate = 3600;

const encode = async (str: string) => {
  const pako = await import('pako');

  const data = Buffer.from(str, 'utf8');

  const compressed = pako.deflate(data, { level: 9 });

  return Buffer.from(compressed).toString('base64').replaceAll('+', '-').replaceAll('/', '_');
};

const resolveIncludes = async (content: string, baseDir: string): Promise<string> => {
  const includeRegex = /^!include\s+(.+)$/gm;
  let resolved = content;
  let match;

  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = match[1].trim();
    const fullPath = path.resolve(baseDir, includePath);

    // Security check
    if (!fullPath.startsWith(BASE_DIR)) {
      throw new Error(`Include path outside allowlist: ${includePath}`);
    }

    try {
      let includeContent = await fs.readFile(fullPath, 'utf8');
      
      // Remove @startuml, @enduml, and !theme from included files to avoid conflicts
      includeContent = includeContent
        .replace(/^@startuml\s*$/gm, '')
        .replace(/^@enduml\s*$/gm, '')
        .replace(/^!theme\s+.+$/gm, '');
      
      // Recursively resolve includes in the included file
      const resolvedInclude = await resolveIncludes(includeContent, path.dirname(fullPath));
      resolved = resolved.replace(match[0], resolvedInclude);
    } catch (error) {
      console.error(`Failed to include file: ${includePath}`, error);
      throw new Error(`Failed to include file: ${includePath}`);
    }
  }

  return resolved;
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang')?.toLowerCase() ?? '';
    const relPath = searchParams.get('path') ?? '';

    const kind = LANG_MAP[lang];

    if (!kind) return NextResponse.json({ error: 'Unsupported lang' }, { status: 400 });

    const abs = path.resolve(BASE_DIR, relPath);

    if (!abs.startsWith(BASE_DIR)) return NextResponse.json({ error: 'Path outside allowlist' }, { status: 400 });

    const data = await fs.readFile(abs, 'utf8');

    // Resolve !include directives
    const resolvedContent = await resolveIncludes(data, path.dirname(abs));

    if (Buffer.byteLength(resolvedContent) > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    const krokiBase = process.env.KROKI_BASE_URL ?? 'http://kroki:8000';

    const encoded = await encode(resolvedContent);
    const url = `${krokiBase}/${kind}/svg/${encoded}`;

    const r = await fetch(url, {
      method: 'get',
    });

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
