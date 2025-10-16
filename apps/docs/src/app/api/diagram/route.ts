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

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang')?.toLowerCase() ?? '';
    const relPath = searchParams.get('path') ?? '';
    const fmt = (searchParams.get('fmt') ?? 'svg').toLowerCase();

    const kind = LANG_MAP[lang];

    if (!kind) return NextResponse.json({ error: 'Unsupported lang' }, { status: 400 });

    const abs = path.resolve(BASE_DIR, relPath);

    if (!abs.startsWith(BASE_DIR)) return NextResponse.json({ error: 'Path outside allowlist' }, { status: 400 });

    const data = await fs.readFile(abs);

    if (data.byteLength > MAX_BYTES) return NextResponse.json({ error: 'File too large' }, { status: 413 });

    const krokiBase = process.env.KROKI_BASE_URL ?? 'http://kroki:8000';
    const url = `${krokiBase}/${kind}/${fmt}`;

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: data.toString(),
    });

    if (!r.ok) return NextResponse.json({ error: `Kroki failed: ${r.status}` }, { status: 502 });

    if (fmt === 'svg') {
      const svg = await r.text();

      return new NextResponse(svg, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    const blob = await r.arrayBuffer();

    return new NextResponse(Buffer.from(blob), {
      status: 200,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Diagram API error:', error);

    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
};
