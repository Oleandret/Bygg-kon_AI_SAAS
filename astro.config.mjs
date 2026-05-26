import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind()],
  server: { host: true, port: parseInt(process.env.PORT || '3000', 10) },
  compressHTML: true
});
