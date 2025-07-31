import { addNavigation, registerButton, registerInput } from '../../../utils';
import Handlebars from 'handlebars';
import mainTemplateSource from '../../RegisterPage/templates/mainTemplateSource.hbs';

addNavigation({
  registerPath: '../RegisterPage/RegisterPage.html',
  loginPath: '../LoginPage/LoginPage.html',
  error404Path: '../ErrorPage/ErrorPage.html',
  error500Path: '../ErrorPage/ErrorPage.html',
  chatPath: '../ChatPage/NotActiveChat/NotActiveChat.html',
  selectedChatPath: '../ChatPage/ActiveChat/ActiveChat.html',
});

registerInput();
registerButton();

document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp({});

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
