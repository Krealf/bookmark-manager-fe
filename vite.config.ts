import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_API_PORT = env.PORT ? Number(env.PORT) : 3000;

  return {
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
      port: VITE_API_PORT as number,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
