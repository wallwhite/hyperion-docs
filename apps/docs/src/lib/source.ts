import { type InferPageType, loader, type LoaderPlugin } from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { contributing, digitalUniversity } from '@/.source';
import { safeLucideIconsPlugin } from './safe-lucide-icons-plugin';

// See https://fumadocs.dev/docs/headless/source-api for more info

// Contributing documentation source
export const contributingSource = loader({
  baseUrl: '/docs/contributing',
  source: contributing.toFumadocsSource(),
  plugins: [safeLucideIconsPlugin()],
});

// Digital University project source
export const digitalUniversitySource = loader({
  baseUrl: '/docs/digital-university',
  source: digitalUniversity.toFumadocsSource(),
  plugins: [safeLucideIconsPlugin(), openapiPlugin() as LoaderPlugin],
});

// Legacy alias for backwards compatibility during migration
export const source = digitalUniversitySource;

// All sources for combined operations (search, etc.)
export const allSources = [contributingSource, digitalUniversitySource];

export const getPageImage = (page: InferPageType<typeof contributingSource> | InferPageType<typeof digitalUniversitySource>) => {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
};

export const getLLMText = async (page: InferPageType<typeof contributingSource> | InferPageType<typeof digitalUniversitySource>) => {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
};
