import { addNavigation, registerButton, registerImg, registerInput } from '../../../utils';
import Handlebars from 'handlebars';
import mainTemplateSource from '../templates/mainTemplateSource.hbs';

addNavigation({
  registerPath: '../RegisterPage/RegisterPage.html',
  loginPath: '../LoginPage/LoginPage.html',
  error404Path: '../ErrorPage/ErrorPage.html',
  error500Path: '../ErrorPage/ErrorPage.html',
  chatPath: '../ChatPage/NotActiveChat/NotActiveChat.html',
  selectedChatPath: '../ChatPage/ActiveChat/ActiveChat.html',
  profilePath: '../ProfilePage/ProfilePage.html',
  editProfilePath: '../ProfilePage/ProfilePage.html',
});

registerInput();
registerButton();
registerImg();

document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const context = {
    inputs: [
      { title: 'Старый пароль', name: 'oldPassword', type: 'password' },
      { title: 'Новый пароль', name: 'newPassword',  type: 'password' },
      { title: 'Повторить новый пароль', name: 'confirmNewPassword', type: 'password' },
    ],
  };

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp(context);

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
