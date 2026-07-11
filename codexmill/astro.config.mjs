// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

const SITE_URL = 'https://staging.codexmill.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ filter: (page) => !page.includes('/thank-you') }),
  ],
  vite: {
    ssr: {
      noExternal: ['gsap'],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});