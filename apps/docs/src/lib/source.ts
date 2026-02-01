import { type InferPageType, loader, type LoaderPlugin } from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { platform, digitalUniversity } from '@/.source';

// See https://fumadocs.dev/docs/headless/source-api for more info

// Platform documentation source
export const platformSource = loader({
  baseUrl: '/docs/platform',
  source: platform.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Digital University project source
export const digitalUniversitySource = loader({
  baseUrl: '/docs/digital-university',
  source: digitalUniversity.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin() as LoaderPlugin],
});

// Legacy alias for backwards compatibility during migration
export const source = digitalUniversitySource;

// All sources for combined operations (search, etc.)
export const allSources = [platformSource, digitalUniversitySource];

export const getPageImage = (page: InferPageType<typeof platformSource> | InferPageType<typeof digitalUniversitySource>) => {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
};

export const getLLMText = async (page: InferPageType<typeof platformSource> | InferPageType<typeof digitalUniversitySource>) => {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
};
