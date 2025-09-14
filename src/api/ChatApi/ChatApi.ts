import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { IUser } from '@api/AuthApi';

import type { ChatList, IToken } from './types';

enum Paths {
  chats = 'chats',
  chatToken = 'chats/token/',
  searchUsers = 'chats/search/',
}

class ChatApiCr extends HTTPTransport {
  getChats() {
    return this.fetch<ChatList>(Method.GET, Paths.chats);
  }

  createChat(title: string) {
    return this.fetch(Method.POST, Paths.chats, { data: { title } });
  }

  getChatTokens(chatId: number) {
    return this.fetch<IToken>(Method.POST, `${Paths.chatToken}/${chatId}`);
  }

  searchUser(loginPart: string) {
    return this.fetch<IUser[], { login: string }>(Method.POST, Paths.searchUsers, { data: { login: loginPart } });
  }
}

export const ChatApi = new ChatApiCr();
