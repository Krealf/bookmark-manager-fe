import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // loadPaths говорит scss, где искать файлы по имени
        loadPaths: [path.resolve(__dirname, 'src/styles')],
        // Автоматическое добавление данной строки
        additionalData: `
        @use "variables" as *;
        @use "helpers" as *;
        `,
      },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
