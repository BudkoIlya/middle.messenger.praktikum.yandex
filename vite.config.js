import { defineConfig } from 'vite';
import { resolve } from 'path';
import pluginChecker from 'vite-plugin-checker';

export default defineConfig(() => {
  return {
    base: '/',
    root: resolve(__dirname, 'src'),

    build: {
      outDir: resolve(__dirname, 'dist'),
      plugins: [
        pluginChecker({ typescript: true, eslint: { lintCommand: 'eslint "./src/**/*.{ts}"' } }),
      ],
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          registerPage: resolve(__dirname, 'src/pages/RegisterPage/RegisterPage.html')
        },
      },
    },
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
      },
    },
    server: { open: true, port: 3000 },
  };
});
