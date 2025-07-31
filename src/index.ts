import { addNavigation } from './utils';

addNavigation({
  registerPath: './pages/RegisterPage/RegisterPage.html',
  loginPath: './pages/LoginPage/LoginPage.html',
  chatPath: './pages/ChatPage/NotActiveChat/NotActiveChat.html',
  selectedChatPath: './pages/ChatPage/ActiveChat/ActiveChat.html',
  error404Path: './pages/ErrorPage/ErrorPage.html',
  error500Path: './pages/ErrorPage/ErrorPage.html',
});
