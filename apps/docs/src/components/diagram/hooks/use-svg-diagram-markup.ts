import { useEffect, useId, useMemo, useState } from 'react';
import { type DiagramParamsBase } from '../types';

const MAX_URI_LENGTH = Number(process.env.KROKI_MAX_URI_LENGTH) || 4096;

export const useSvgDiagramMarkup = ({ lang, path, chart }: DiagramParamsBase) => {
  const id = useId();
  const [svg, setSvg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mermaidContent, setMermaidContent] = useState<string>('');

  const requestConfig = useMemo(() => {
    // For mermaid with chart content, render client-side
    if (lang === 'mermaid' && chart) return null;

    const params = new URLSearchParams({ lang });

    // Determine if we should use POST based on content size
    const contentToSend = chart || '';

    // If using path, always use GET
    if (path) {
      params.set('path', path);
      return {
        url: `/api/diagram?${params.toString()}`,
        method: 'GET' as const,
        body: null,
      };
    }

    // If using content, check URL length
    if (chart) {
      const testUrl = `/api/diagram?${params.toString()}&content=${encodeURIComponent(chart)}`;

      if (testUrl.length > MAX_URI_LENGTH) {
        // Use POST for large content
        return {
          url: `/api/diagram?${params.toString()}`,
          method: 'POST' as const,
          body: contentToSend,
        };
      } else {
        // Use GET for small content
        params.set('content', chart);
        return {
          url: `/api/diagram?${params.toString()}`,
          method: 'GET' as const,
          body: null,
        };
      }
    }

    throw new Error('Either chart or path is required');
  }, [lang, path, chart]);

  useEffect(() => {
    if (!requestConfig) return;

    const fetchDiagram = async () => {
      setIsLoading(true);

      const fetchOptions: RequestInit = {
        method: requestConfig.method,
      };

      if (requestConfig.method === 'POST' && requestConfig.body) {
        fetchOptions.headers = { 'Content-Type': 'text/plain' };
        fetchOptions.body = requestConfig.body;
      }

      const response = await fetch(requestConfig.url, fetchOptions).then(async (res) => {
        if (!res.ok) throw new Error(`Diagram fetch failed: ${res.status}`);

        return res.text();
      });

      // For Mermaid diagrams from files, the API returns raw content
      if (lang === 'mermaid') {
        setMermaidContent(response);
      } else {
        // For other diagrams, the API returns SVG
        setSvg(response);
        setIsLoading(false);
      }
    };

    fetchDiagram().catch(() => {
      console.error('Error while fetching diagram');
      setIsLoading(false);
    });
  }, [requestConfig, lang]);

  useEffect(() => {
    if (lang !== 'mermaid') return;

    // Use chart content if provided, otherwise use content fetched from file
    const contentToRender = chart || mermaidContent;
    if (!contentToRender) return;

    const renderChart = async () => {
      const { default: mermaid } = await import('mermaid');

      try {
        setIsLoading(true);
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'inherit',
          themeCSS: 'margin: 1.5rem auto 0;',
          theme: 'default',
        });

        const { svg: mermaidSvg } = await mermaid.render(id, contentToRender.replaceAll('\\n', '\n'));

        setSvg(mermaidSvg);
        setIsLoading(false);
      } catch (error) {
        console.error('Error while rendering mermaid', error);
        setIsLoading(false);
      }
    };

    renderChart().catch(() => {
      console.error('Error while rendering mermaid');
    });
  }, [chart, mermaidContent, id, lang]);

  return { svg, isLoading };
};
