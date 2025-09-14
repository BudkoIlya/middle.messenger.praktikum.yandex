import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Link } from '@components/link';
import { ChatItem } from '@pages/Chat/common/components/chatItems/chatItem';
import type { IUser } from '@api/AuthApi';
import type { IChat } from '@api/ChatApi';

import type { IChatItems } from '../components/chatItems';

import styles from '../components/chatItems/styles/chatItems.module.scss';

export const getContext = ({
  active = false,
  chat,
  user,
}: {
  active?: boolean;
  chat?: IChat;
  user?: IUser;
}): IChatItems => {
  const chatItems = chat?.chatList?.map<ChatItem>(({ last_message, title }) => {
    // const { login } = last_message?.user || {};
    const { time } = last_message || {};
    return new ChatItem({
      userName: title,
      time,
      lastMessage: '12312',
      class: active ? styles['chat__item--active'] : '',
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
