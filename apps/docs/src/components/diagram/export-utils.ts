const DEFAULT_FILENAME = 'diagram';
const SCALE = 2;

const LINE_HEIGHT = 18;

const findLiveSvg = (diagramId?: string): SVGSVGElement | null => {
  // If a specific diagram ID is provided, use it to find the exact diagram
  if (diagramId) {
    const specific = document.querySelector<SVGSVGElement>(`[data-diagram-id="${diagramId}"] svg`);
    if (specific) return specific;
  }

  // Fallback to old behavior for compatibility (whiteboard modal)
  const whiteboard = document.querySelector<SVGSVGElement>('.react-flow__node svg');
  if (whiteboard) return whiteboard;

  return null;
};

const cloneSvgWithInlineStyles = (sourceSvg: SVGSVGElement): SVGSVGElement => {
  const clone = sourceSvg.cloneNode(true) as SVGSVGElement;

  const walkAndInline = (source: Element, target: Element) => {
    const computed = window.getComputedStyle(source);
    const el = target as HTMLElement | SVGElement;

    const props = [
      'fill',
      'stroke',
      'stroke-width',
      'stroke-dasharray',
      'stroke-linecap',
      'stroke-linejoin',
      'opacity',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'text-anchor',
      'dominant-baseline',
      'color',
      'background-color',
      'visibility',
      'display',
    ];

    for (const prop of props) {
      const value = computed.getPropertyValue(prop);
      if (value !== '') {
        el.style.setProperty(prop, value);
      }
    }

    const sourceChildren = source.children;
    const targetChildren = target.children;

    for (let i = 0; i < Math.min(sourceChildren.length, targetChildren.length); i++) {
      walkAndInline(sourceChildren[i], targetChildren[i]);
    }
  };

  walkAndInline(sourceSvg, clone);

  return clone;
};

const getDimensions = (svgEl: SVGSVGElement): { width: number; height: number } => {
  const viewBox = svgEl.getAttribute('viewBox');

  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number);

    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }
  }

  const w = parseFloat(svgEl.getAttribute('width') ?? '0');
  const h = parseFloat(svgEl.getAttribute('height') ?? '0');

  if (w > 0 && h > 0) return { width: w, height: h };

  const bbox = svgEl.getBoundingClientRect();

  return { width: bbox.width || 800, height: bbox.height || 600 };
};

const getBaseSvg = (svgMarkup: string, diagramId?: string): { svgEl: SVGSVGElement; width: number; height: number } => {
  let svgEl: SVGSVGElement;
  let width: number;
  let height: number;

  // Try to find the live SVG element first (preserves computed styles)
  const liveSvg = findLiveSvg(diagramId);
  if (liveSvg) {
    // Get dimensions from the ORIGINAL live SVG before cloning
    const liveDimensions = getDimensions(liveSvg);
    width = liveDimensions.width;
    height = liveDimensions.height;

    svgEl = cloneSvgWithInlineStyles(liveSvg);
  } else {
    // Fallback: parse from the raw markup string
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
    const parsed = doc.querySelector('svg');

    if (!parsed) {
      throw new Error('No SVG element found');
    }

    svgEl = parsed;
    const parsedDimensions = getDimensions(svgEl);
    width = parsedDimensions.width;
    height = parsedDimensions.height;
  }

  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgEl.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svgEl.setAttribute('width', String(width));
  svgEl.setAttribute('height', String(height));

  return { svgEl, width, height };
};

const extractLines = (fo: Element): string[] => {
  const lines: string[] = [];
  let current = '';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      current += node.textContent ?? '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName.toLowerCase();

      if (tag === 'br') {
        lines.push(current.trim());
        current = '';
      } else if (tag === 'div' || tag === 'p') {
        if (current.trim()) {
          lines.push(current.trim());
          current = '';
        }

        for (const child of node.childNodes) {
          walk(child);
        }

        if (current.trim()) {
          lines.push(current.trim());
          current = '';
        }

        return;
      } else {
        for (const child of node.childNodes) {
          walk(child);
        }

        return;
      }
    }
  };

  for (const child of fo.childNodes) {
    walk(child);
  }

  if (current.trim()) {
    lines.push(current.trim());
  }

  return lines.filter((l) => l.length > 0);
};

const sanitizeForCanvas = (svgEl: SVGSVGElement) => {
  // Remove external images that taint the canvas
  const images = svgEl.querySelectorAll('image');

  for (const img of images) {
    const href = img.getAttribute('href') ?? img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ?? '';

    if (href.startsWith('http://') || href.startsWith('https://')) {
      img.remove();
    }
  }

  // Replace foreignObject with multiline <text>
  const foreignObjects = svgEl.querySelectorAll('foreignObject');

  for (const fo of foreignObjects) {
    const lines = extractLines(fo);

    if (lines.length === 0) {
      fo.remove();
      continue;
    }

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const x = parseFloat(fo.getAttribute('x') ?? '0');
    const y = parseFloat(fo.getAttribute('y') ?? '0');
    const foWidth = parseFloat(fo.getAttribute('width') ?? '0');

    const centerX = x + foWidth / 2;

    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('font-size', '14');
    textEl.setAttribute('fill', '#333');
    textEl.setAttribute('font-family', 'sans-serif');

    for (let i = 0; i < lines.length; i++) {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', String(centerX));
      tspan.setAttribute('y', String(y + 16 + i * LINE_HEIGHT));
      tspan.textContent = lines[i];
      textEl.appendChild(tspan);
    }

    fo.parentNode?.replaceChild(textEl, fo);
  }
};

const svgToCanvas = (svgMarkup: string, diagramId?: string): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const { svgEl, width, height } = getBaseSvg(svgMarkup, diagramId);

    // Add extra height to prevent bottom truncation in PNG export
    const adjustedHeight = height + 50;
    svgEl.setAttribute('height', String(adjustedHeight));

    sanitizeForCanvas(svgEl);

    const serialized = new XMLSerializer().serializeToString(svgEl);

    const canvas = document.createElement('canvas');
    canvas.width = width * SCALE;
    canvas.height = adjustedHeight * SCALE;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    ctx.scale(SCALE, SCALE);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, adjustedHeight);
      ctx.drawImage(img, 0, 0, width, adjustedHeight);
      resolve({ canvas, width, height: adjustedHeight });
    };

    img.onerror = () => {
      reject(new Error('Failed to render SVG to canvas'));
    };

    img.src = dataUri;
  });
};

const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const exportAsSvg = (svg: string, filename = DEFAULT_FILENAME, diagramId?: string) => {
  const { svgEl } = getBaseSvg(svg, diagramId);

  sanitizeForCanvas(svgEl);

  // Remove <style> blocks — all styles are inlined, and scoped selectors
  // (e.g. Mermaid's #id-based rules) won't resolve in a standalone file.
  const styles = svgEl.querySelectorAll('style');

  for (const s of styles) {
    s.remove();
  }

  const serialized = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  download(blob, `${filename}.svg`);
};

export const exportAsPng = async (svg: string, filename = DEFAULT_FILENAME, diagramId?: string) => {
  const { canvas } = await svgToCanvas(svg, diagramId);

  canvas.toBlob((blob) => {
    if (blob) download(blob, `${filename}.png`);
  }, 'image/png');
};
