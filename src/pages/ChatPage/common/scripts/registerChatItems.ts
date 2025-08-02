import Handlebars from 'handlebars';
import ChatItems from '../templates/ChatItems.hbs';
import { registerButton, registerChatItem } from '../../../../utils';

export const registerChatItems = () => {
  registerChatItem();
  registerButton();
  Handlebars.registerPartial('ChatItems', ChatItems);
};

export const CONTEXT = {
  chatItems: [
    { userName: 'Роман', lastMessage: 'Привет', time: '12:00', unreadCount: '1' },
    { userName: 'Алиса', lastMessage: 'Привет', time: '12:00', unreadCount: '1' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Роман', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00', class: 'chat__item--active' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: 'Пт' },
    { userName: 'Артём', lastMessage: 'Привет', time: '1 июля' },
  ],
  button: {
    name: 'Добавить',
    class: 'add_btn'
  }
};
