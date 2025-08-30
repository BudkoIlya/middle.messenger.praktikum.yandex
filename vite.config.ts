import { resolve } from 'path';

import { defineConfig } from 'vite';
import pluginChecker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';

type ManualChunks = (id: string) => string | undefined;

const getPackageNameFromId = (id: string): string | undefined => {
  const module = id.match(/[/\\]node_modules[/\\](@[^/\\]+[/\\][^/\\]+|[^/\\]+)/);
  const raw = module?.[1];
  if (!raw) return;

  const normalized = raw.replace(/\\/g, '/'); // нормализуем слеши
  return normalized.startsWith('@') ? normalized : normalized.split('/')[0];
};

const manualChunks: ManualChunks = (id) => {
  const pkgName = getPackageNameFromId(id);
  if (!pkgName) return;

  const name = pkgName.replace(/^@/, '').replace(/\//g, '_');
  return `module_${name}`;
};

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
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: { input: { main: resolve(__dirname, 'src/index.html') }, output: { manualChunks } },
  },
  resolve: { alias: { src: resolve(__dirname, './src') } },
  server: { open: true, port: 3000 },
  preview: { port: 3000 },
}));
