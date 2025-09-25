import type { IUser } from '@store/UserStore/types';

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  time: string;
  is_read: boolean;
};

export type ChatList = {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  };
}[];

export type IChat = {
  activeChat?: {
    chatUsers: IUser[];
    chatId: number;
    messages?: ChatMessage[];
  };
  chatList?: ChatList;
  activeChatId?: number;
};
