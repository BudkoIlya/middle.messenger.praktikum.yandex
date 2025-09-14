import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';

import type { ChatList, ITokens } from './types';

enum Paths {
  chats = 'chats',
  chatToken = 'chats/token/',
}

class ChatApiCr extends HTTPTransport {
  getChats() {
    return this.fetch<ChatList>(Method.GET, Paths.chats);
  }

  createChat(title: string) {
    return this.fetch(Method.POST, Paths.chats, { data: { title } });
  }

  connectChat(chatId: string) {
    return this.fetch<ITokens>(Method.POST, `${Paths.chatToken}/${chatId}`);
  }
}

export const ChatApi = new ChatApiCr();
