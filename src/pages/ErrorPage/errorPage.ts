import { addNavigation } from '../../utils';

addNavigation({
  registerPath: '../RegisterPage/RegisterPage.html',
  loginPath: '../LoginPage/LoginPage.html',
  error404Path: './ErrorPage.html',
  error500Path: './ErrorPage.html',
  chatPath: '../ChatPage/NotActiveChat/NotActiveChat.html',
  selectedChatPath: '../ChatPage/ActiveChat/ActiveChat.html',
  profilePath: '../ProfilePage/ProfilePage.html',
  editProfilePath: '../ProfilePage/ProfilePage.html',
  editPasswordPath: '../EditPasswordPage/EditPasswordPage.html',
});

const params = new URLSearchParams(window.location.search);
const type = params.get('type');

if (type) {
  const title = document.querySelector('.title');

  if (title) {
    title.textContent = type;
  }

  switch (type) {
    case '404':
      document.title = '404';
      break;
    case '500':
      document.title = '500';
      break;
    default:
      document.title = 'Неизвестная ошибка';
  }
}