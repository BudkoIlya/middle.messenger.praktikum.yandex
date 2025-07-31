import {
  addNavigation,
  registerButton,
  registerChatItem,
  registerInput,
  registerMessage,
} from '../../../../utils';
import Handlebars from 'handlebars';
import mainTemplateSource from '../templates/mainTemplateSource.hbs';
import { chatItem } from '../../../../common/chatItem';

addNavigation({
  registerPath: '../../RegisterPage/RegisterPage.html',
  loginPath: '../../LoginPage/LoginPage.html',
  error404Path: '../../ErrorPage/ErrorPage.html',
  chatPath: '../NotActiveChat/NotActiveChat.html',
});
Handlebars.registerPartial('chatItem', chatItem);

registerInput();
registerChatItem();
registerButton();
registerMessage();


document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp({});

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
