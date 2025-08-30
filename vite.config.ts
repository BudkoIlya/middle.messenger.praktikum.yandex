import { resolve } from 'path';

import { defineConfig } from 'vite';
import pluginChecker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  base: '/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    viteTsconfigPaths(),
    pluginChecker({
      typescript: { tsconfigPath: `./tsconfig.json` },
      eslint: {
        watchPath: 'src',
        lintCommand: `eslint "./**/*.ts"`,
        useFlatConfig: true,
        dev: { logLevel: ['error'] },
      },
      stylelint: { watchPath: 'src', lintCommand: `stylelint "./**/*.scss"`, dev: { logLevel: ['error'] } },
    }),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: { main: resolve(__dirname, 'src/index.html') },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'node_modules';
        },
      },
    },
  },
  resolve: { alias: { src: resolve(__dirname, './src') } },
  server: { open: true, port: 3000 },
  preview: { port: 3000 },
}));
