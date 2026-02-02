import { type SupportedLanguage } from '@/lib/constants';

export interface DiagramParamsBase {
  lang: SupportedLanguage;
  path?: string;
  chart?: string;
}

export interface DiagramWithContentParams extends DiagramParamsBase {
  chart: string;
  path?: never;
}

export interface DiagramWithPathParams extends DiagramParamsBase {
  path: string;
  chart?: never;
}

export type DiagramParams = DiagramWithContentParams | DiagramWithPathParams;
