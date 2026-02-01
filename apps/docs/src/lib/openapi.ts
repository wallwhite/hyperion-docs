import { createOpenAPI } from 'fumadocs-openapi/server';
import * as fs from 'node:fs';
import * as path from 'node:path';

// For runtime OpenAPI loading, scan content directory for specs
const findAllOpenAPISpecs = (): string[] => {
  const contentDir = path.resolve(process.cwd(), '../../content');
  const specs: string[] = [];

  try {
    const entries = fs.readdirSync(contentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        const openapiDir = path.join(contentDir, entry.name, 'openapi');
        if (fs.existsSync(openapiDir)) {
          const yamlFiles = fs.readdirSync(openapiDir)
            .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
            .map(f => path.join(openapiDir, f));
          specs.push(...yamlFiles);
        }
      }
    }
  } catch {
    // Fallback for build time when content may not be accessible
    console.warn('Could not scan for OpenAPI specs, using empty list');
  }

  return specs;
};

const specs = findAllOpenAPISpecs();

// Build a map from generated paths (which may differ) to actual runtime paths
// The MDX files embed absolute paths from the machine that ran `pnpm build:openapi`
// At runtime (especially in Docker), we need to find the actual file
const pathMap = new Map<string, string>();
for (const spec of specs) {
  // Map the actual path to itself
  pathMap.set(spec, spec);

  // Also create mapping for common path patterns in generated files
  // Extract the relative path pattern: {project}/openapi/{filename}
  const parts = spec.split('/');
  const openapiIdx = parts.lastIndexOf('openapi');
  if (openapiIdx > 0) {
    const projectName = parts[openapiIdx - 1];
    const filename = parts[openapiIdx + 1];
    // Create a normalized key based on project/filename
    const normalizedKey = `${projectName}/openapi/${filename}`;
    pathMap.set(normalizedKey, spec);
  }
}

// Custom loader that resolves paths considering the path differences
const createOpenAPIWithPathMapping = () => {
  const baseOpenAPI = createOpenAPI({
    input: specs.length > 0 ? specs : [],
  });

  return {
    ...baseOpenAPI,
    getAPIPageProps: (props: { document: string; operations?: unknown[]; webhooks?: unknown[]; hasHead?: boolean }) => {
      // Try to remap the document path if it doesn't exist locally
      let resolvedDocument = props.document;

      // If the document path doesn't exist, try to find it by pattern matching
      if (!fs.existsSync(resolvedDocument)) {
        // Extract the normalized key from the path
        const parts = resolvedDocument.split('/');
        const openapiIdx = parts.lastIndexOf('openapi');
        if (openapiIdx > 0 && parts.length > openapiIdx + 1) {
          const projectName = parts[openapiIdx - 1];
          const filename = parts[openapiIdx + 1];
          const normalizedKey = `${projectName}/openapi/${filename}`;

          const mappedPath = pathMap.get(normalizedKey);
          if (mappedPath && fs.existsSync(mappedPath)) {
            resolvedDocument = mappedPath;
          }
        }
      }

      return baseOpenAPI.getAPIPageProps({
        ...props,
        document: resolvedDocument,
      });
    },
  };
};

export const openapi = createOpenAPIWithPathMapping();
