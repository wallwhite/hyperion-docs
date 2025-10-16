import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '@/lib/openapi';

generateFiles({
  input: openapi,
  output: './content/docs',
  includeDescription: true,
}).catch((error) => {
  console.error('Failed to build OpenAPI spec docs', error);
});
