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

export type ITokens = {
  token: string;
}[];

export type IChat = {
  tokens?: string;
  chatList?: ChatList;
  activeChatId?: number;
} | null;
