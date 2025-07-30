import { addNavigation, registerChatItem, registerInput } from '../../../../utils';
import Handlebars from 'handlebars';
import mainTemplateSource from '../templates/mainTemplateSource.hbs';
import { chatItem } from '../../../../common/chatItem';

addNavigation({
  registerPath: '../../RegisterPage/RegisterPage.html',
  loginPath: '../../LoginPage/LoginPage.html',
  error404Path: '../../ErrorPage/ErrorPage.html',
});
Handlebars.registerPartial('chatItem', chatItem);

registerInput();
registerChatItem();

document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp({});

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
