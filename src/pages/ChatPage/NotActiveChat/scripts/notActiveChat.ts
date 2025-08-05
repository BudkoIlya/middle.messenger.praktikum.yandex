import Handlebars from 'handlebars';

import { addNavigation, registerInput } from '../../../../utils';
import mainTemplateSource from '../templates/mainTemplateSource.hbs';
import { chatItem } from '../../../../common/chatItem';
import { CONTEXT, registerChatItems } from '../../common/scripts/registerChatItems';

addNavigation({
  registerPath: '../../RegisterPage/RegisterPage.html',
  loginPath: '../../LoginPage/LoginPage.html',
  error404Path: '../../ErrorPage/ErrorPage.html',
  selectedChatPath: '../ActiveChat/ActiveChat.html',
  profilePath: '../../ProfilePage/ProfilePage.html',
  editProfilePath: '../../ProfilePage/ProfilePage.html',
  editPasswordPath: '../../EditPasswordPage/EditPasswordPage.html',
});
Handlebars.registerPartial('chatItem', chatItem);

registerInput();
registerChatItems();

document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('main');

  const mainTmp = Handlebars.compile(mainTemplateSource);
  const mainSource = mainTmp(CONTEXT);

  if (currentEl) {
    currentEl.insertAdjacentHTML('beforeend', mainSource);
  }
});
