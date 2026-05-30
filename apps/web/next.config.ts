import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
  transpilePackages: ['@repo/shared', '@repo/ui'],
  turbopack: {
    root: monorepoRoot,
  },
};

export default withNextIntl(nextConfig);
