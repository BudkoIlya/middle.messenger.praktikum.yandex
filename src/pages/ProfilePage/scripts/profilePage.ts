import Handlebars from 'handlebars';

import { addNavigation, registerButton, registerImg, registerInput } from '../../../utils';
import mainTemplateSource from '../templates/mainTemplateSource.hbs';

addNavigation({
  registerPath: '../RegisterPage/RegisterPage.html',
  loginPath: '../LoginPage/LoginPage.html',
  error404Path: '../ErrorPage/ErrorPage.html',
  error500Path: '../ErrorPage/ErrorPage.html',
  chatPath: '../ChatPage/NotActiveChat/NotActiveChat.html',
  selectedChatPath: '../ChatPage/ActiveChat/ActiveChat.html',
  editPasswordPath: '../EditPasswordPage/EditPasswordPage.html',
});

registerInput();
registerButton();
registerImg();

document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }

  const isDisabled = mode === 'view' ? 'disabled' : '';

  const context = {
    inputs: [
      { title: 'Почта', name: 'email', disabled: isDisabled, value: 'example@yandex.ru', type: 'text' },
      { title: 'Логин', name: 'login', disabled: isDisabled, value: 'login', type: 'text' },
      { title: 'Имя', name: 'name', disabled: isDisabled, value: 'Имя', type: 'text' },
      { title: 'Фамилия', name: 'second_name', disabled: isDisabled, value: 'Фамилия', type: 'text' },
    ],
    isViewMode: mode === 'view',
  };

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp(context);

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
