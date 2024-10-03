import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: { babelrc: true },
    }),
    visualizer(),
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
