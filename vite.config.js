import { defineConfig } from 'vite';
import { resolve } from 'path';
import pluginChecker from 'vite-plugin-checker';

export default defineConfig(() => ({
  base: '/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    plugins: [
      pluginChecker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "src/**/*.ts"',
        },
        stylelint: {
          lintCommand: 'stylelint "src/**/*.scss"',
        },
      }),
    ],
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        registerPage: resolve(__dirname, 'src/pages/RegisterPage/RegisterPage.html'),
        loginPage: resolve(__dirname, 'src/pages/LoginPage/LoginPage.html'),
        errorPage: resolve(__dirname, 'src/pages/ErrorPage/ErrorPage.html'),
        activeChat: resolve(__dirname, 'src/pages/ChatPage/ActiveChat/ActiveChat.html'),
        notActiveChat: resolve(__dirname, 'src/pages/ChatPage/NotActiveChat/NotActiveChat.html'),
        profilePage: resolve(__dirname, 'src/pages/ProfilePage/ProfilePage.html'),
        passwordEditPage: resolve(__dirname, 'src/pages/EditPasswordPage/EditPasswordPage.html'),
      },
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  server: { open: true, port: 3000 },
}));
