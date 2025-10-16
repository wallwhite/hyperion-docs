export const SupportedLanguages = {
  puml: 'plantuml',
  plantuml: 'plantuml',
  dot: 'graphviz',
  graphviz: 'graphviz',
  mermaid: 'mermaid',
  c4plantuml: 'c4plantuml',
} as const;

export type SupportedLanguage = keyof typeof SupportedLanguages;

export const LANG_NAME_MAP = {
  [SupportedLanguages.puml]: 'PlantUML',
  [SupportedLanguages.dot]: 'Graphviz',
  [SupportedLanguages.mermaid]: 'Mermaid',
  [SupportedLanguages.c4plantuml]: 'C4 PlantUML',
} as const;
