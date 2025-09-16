export type IToken = {
  token: string;
};

export type RequestAddUsersToChat = {
  users: number[];
  chatId: number;
};

export type RequestDeleteUsersFromChat = {
  users: number[];
  chatId: number;
};
