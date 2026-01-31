import { createMDX } from 'fumadocs-mdx/next';
import { SERVER_ENV } from './src/env.ts';

const withMDX = createMDX();
const isStatic = SERVER_ENV().IS_PROD_STATIC;

if (isStatic) {
  console.log('Building Docs as Static Export for GitHub Pages\n');
} else {
  console.log('Building Docs as Standalone Next.js App\n');
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  ...(isStatic && {
    output: 'export',
    distDir: 'out',
    images: { unoptimized: true },
    basePath: '/' + SERVER_ENV().GITHUB_PAGES_REPO_NAME,
  }),
  ...(!isStatic && {
    output: 'standalone',
  }),
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checks enabled
    ignoreBuildErrors: false,
  },
};

export default withMDX(config);
