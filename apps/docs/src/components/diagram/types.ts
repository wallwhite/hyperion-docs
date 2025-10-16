import { type SupportedLanguage } from '@/lib/constants';

export interface DiagramParamsBase {
  lang: SupportedLanguage;
  path: string;
  chart?: string;
}

export interface MermaidParams extends DiagramParamsBase {
  lang: 'mermaid';
  chart: string;
}

export interface KrokiParams extends DiagramParamsBase {
  lang: Exclude<SupportedLanguage, 'mermaid'>;
  path: string;
  chart: never;
}

export type DiagramParams = MermaidParams | KrokiParams;
