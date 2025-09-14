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

export type IToken = {
  token: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  time: string;
  is_read: boolean;
};

export type IChat = {
  activeChat?: {
    chatId: number;
    messages?: ChatMessage[];
  };
  chatList?: ChatList;
  activeChatId?: number;
};
