import { BASE_URL } from '@api/constants';
import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';

import type { ChatList } from './types';

enum Paths {
  chats = `${BASE_URL}/chats`,
}

class ChatApiCr extends HTTPTransport {
  getChats() {
    return this.fetch<ChatList>(Method.GET, Paths.chats);
  }

  createChat(title: string) {
    return this.fetch(Method.POST, Paths.chats, { data: { title } });
  }
}

export const ChatApi = new ChatApiCr();
