import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Link } from '@components/link';
import { ChatItem } from '@pages/Chat/common/components/chatItems/chatItem';
import { formatDate } from '@utils';
import type { IChat } from '@store/ChatStore/types';
import type { IUser } from '@store/UserStore/types';

import type { IChatItems } from '../components/chatItems';

import styles from '../components/chatItems/styles/chatItems.module.scss';

type GetContext = (v: { chat?: IChat; user?: IUser }) => IChatItems;

export const getContext: GetContext = ({ chat, user }) => {
  const chatItems = chat?.chatList?.map<ChatItem>(({ last_message, title, id, unread_count }) => {
    const { time, content } = last_message || {};

    return new ChatItem({
      id,
      title,
      time: formatDate(time),
      lastMessage: content,
      class: chat.activeChat?.chatId === id ? styles['chat__item--active'] : '',
      unreadCount: unread_count,
    });
  });

  return {
    chatItems,
    link: new Link({
      className: styles['chat__user-link'],
      path: PathConfig[LinksPages.profile].view,
      text: user?.login,
    }),
  };
};
