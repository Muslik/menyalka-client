import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    react({
      babel: { babelrc: true },
    }),
    visualizer(),
    svgr(),
  ],
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
