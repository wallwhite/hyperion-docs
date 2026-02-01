import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import * as fs from 'node:fs';
import * as path from 'node:path';

// CONTENT_DIR must be relative from the script's working directory (apps/docs)
// because fumadocs-openapi's generateFiles() joins the output path with cwd
const CONTENT_DIR = '../../content';
const CONTENT_DIR_ABS = path.resolve(process.cwd(), CONTENT_DIR);

// Find all projects with openapi directories
const findOpenAPIProjects = (): string[] => {
  const projects: string[] = [];

  try {
    const entries = fs.readdirSync(CONTENT_DIR_ABS, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        const openapiDir = path.join(CONTENT_DIR_ABS, entry.name, 'openapi');
        if (fs.existsSync(openapiDir)) {
          const yamlFiles = fs.readdirSync(openapiDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
          if (yamlFiles.length > 0) {
            projects.push(entry.name);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error scanning for OpenAPI projects:', error);
  }

  return projects;
};

const generateAllDocs = async () => {
  const projects = findOpenAPIProjects();

  if (projects.length === 0) {
    console.log('No OpenAPI specs found in any project');
    return;
  }

  console.log(`Found OpenAPI specs in projects: ${projects.join(', ')}`);

  for (const project of projects) {
    const openapiDirAbs = path.join(CONTENT_DIR_ABS, project, 'openapi');
    // outputDir must be relative so fumadocs-openapi generates in the correct location
    const outputDir = path.join(CONTENT_DIR, project, 'docs', 'openapi', '(generated)');

    // Get all yaml files in the project's openapi directory
    const yamlFiles = fs.readdirSync(openapiDirAbs)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .map(f => path.join(openapiDirAbs, f));

    if (yamlFiles.length === 0) continue;

    console.log(`Generating docs for ${project} from ${yamlFiles.length} spec(s)`);

    const openapi = createOpenAPI({
      input: yamlFiles,
    });

    try {
      await generateFiles({
        input: openapi,
        output: outputDir,
        includeDescription: true,
      });
      console.log(`Generated docs for ${project} at ${outputDir}`);
    } catch (error) {
      console.error(`Failed to generate docs for ${project}:`, error);
    }
  }
};

generateAllDocs().catch((error) => {
  console.error('Failed to build OpenAPI spec docs', error);
  process.exit(1);
});
