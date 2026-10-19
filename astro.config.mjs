import { defineConfig } from 'astro/config';

// GitHub Pages: set SITE_URL (for example https://abhigyan1805.github.io) and
// BASE_PATH (for example /portfolio-site/) at build time. Both default to a
// root deployment.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://abhigyan1805.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
