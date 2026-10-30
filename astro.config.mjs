// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { citations } from './src/plugins/satteri-citations.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://mariuswinger.github.io',
  integrations: [react(), mdx()],
  markdown: {
    processor: satteri({ mdastPlugins: [citations] }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
