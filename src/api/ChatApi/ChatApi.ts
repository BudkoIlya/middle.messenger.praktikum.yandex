import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { ChatList } from '@store/ChatStore/types';
import type { IUser } from '@store/UserStore/types';

import type { IToken, RequestAddUsersToChat } from './types';

enum Paths {
  chats = 'chats',
  chatToken = 'chats/token/',
  searchUsers = 'user/search',
  chatUsers = 'chats/:id/users',
  chatsUsers = 'chats/users',
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

  addUsersToChat(data: RequestAddUsersToChat) {
    return this.fetch<void, RequestAddUsersToChat>(Method.PUT, Paths.chatsUsers, { data });
  }

  deleteUsersFromChat(data: RequestAddUsersToChat) {
    return this.fetch<void, RequestAddUsersToChat>(Method.DELETE, Paths.chatsUsers, { data });
  }

  getChatUsers(chatId: number) {
    return this.fetch<IUser[], RequestAddUsersToChat>(Method.GET, Paths.chatUsers.replace(':id', chatId.toString()));
  }
}

export const ChatApi = new ChatApiCr();
