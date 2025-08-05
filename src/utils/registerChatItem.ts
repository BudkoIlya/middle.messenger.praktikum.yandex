import Handlebars from 'handlebars';

import { chatItem } from '../common/chatItem';
import '../common/chatItem/styles/chatItem.scss';

export const registerChatItem = () => {
  Handlebars.registerPartial('chatItem', chatItem);
};
