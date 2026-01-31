import { rm } from 'fs/promises';
import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '@/lib/openapi';
import { SERVER_ENV } from '@/env';

const outputPath =
  './content/docs/' + SERVER_ENV().API_RES_PATH + '/(generated)';

const run = async () => {
  await rm(outputPath, { recursive: true, force: true });
  console.info(`Cleared all files at ${outputPath} \n`);

  await generateFiles({
    input: openapi,
    output: outputPath,
    includeDescription: true,
  });
};

run().catch((error) => {
  console.error('Failed to build OpenAPI spec docs', error);
});
