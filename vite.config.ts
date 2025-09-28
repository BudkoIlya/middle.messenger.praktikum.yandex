import { resolve } from 'path';

import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import pluginChecker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  base: '/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    patchCssModules({ generateSourceTypes: true }),
    viteTsconfigPaths(),
    pluginChecker({
      typescript: { tsconfigPath: `./tsconfig.json` },
      eslint: {
        watchPath: 'src',
        lintCommand: 'eslint "**/*.ts" --cache --cache-location ../node_modules/.cache/eslint/.eslintcache',
        useFlatConfig: true,
        dev: { logLevel: ['error'] },
      },
      stylelint: {
        watchPath: 'src',
        lintCommand: 'stylelint "**/*.scss" --cache --cache-location ../node_modules/.cache/stylelint/.stylelintcache',
        dev: { logLevel: ['error'] },
      },
    }),
  ],
  css: { modules: { generateScopedName: '[name]_[local]__[hash:base64:5]' } },
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: { main: resolve(__dirname, 'src/index.html') },
      output: {
        manualChunks(id) {
          if (id.includes('handlebars')) return 'handlebars_module';
          if (id.includes('uuid')) return 'uuid_module';
        },
      },
    },
  },
  resolve: { alias: { src: resolve(__dirname, './src') } },
  server: { open: true, port: 3000 },
  preview: { port: 3000 },
}));
