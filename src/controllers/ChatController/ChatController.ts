import { ChatApi } from '@api/ChatApi';
import { WSTransport } from '@api/WSTrasnsport';
import { WSTransportEvents } from '@api/WSTrasnsport/WSTransport';
import { Router } from '@common/Router';
import { LinksPages } from '@common/Router/PathConfig';
import { chatStore, store } from '@store';
import { isArray, withLoader } from '@utils';
import { withTryCatch } from '@utils/withTryCatch';
import type { RequestAddUsersToChat, RequestDeleteUsersFromChat } from '@api/ChatApi';
import type { BaseWsMessage } from '@api/WSTrasnsport/WSTransport';
import type { ChatMessage } from '@store/ChatStore/types';

type WSChatMessage = ChatMessage & { type: string };

import { BaseController } from '../BaseController';

class ChatControllerCrt extends BaseController<{ message: string }> {
  private readonly _websocket: WSTransport<BaseWsMessage<WSChatMessage>>;

  isConnected = false;

  constructor() {
    super();
    this._websocket = new WSTransport<BaseWsMessage<WSChatMessage>>();
  }

  async getChats() {
    await withTryCatch(async () => {
      const data = await ChatApi.getChats();
      chatStore.set('chatList', data);
    });
  }

  async createChat(title: string) {
    await withTryCatch(async () => {
      await ChatApi.createChat(title);
      await this.getChats();
    });
  }

  async deleteChat(id: number) {
    await withTryCatch(async () => {
      await ChatApi.deleteChat(id);
      await this.getChats();
    });
  }

  private _onMsg = (msg: WSChatMessage | WSChatMessage[]) => {
    const prev = store.state?.chat.activeChat?.messages ?? [];
    const msgs = (() => {
      if (isArray(msg)) {
        return msg.map(({ type: _t, ...rest }) => rest);
      }
      const { type: _t, ...m } = msg;
      return [m];
    })();

    // Почему-то приходят не отсортированные по дате
    chatStore.set(
      'activeChat.messages',
      [...prev, ...msgs].sort((a, b) => Date.parse(a.time) - Date.parse(b.time)),
    );
  };

  private _onOpen = () => {
    this._websocket.send({ type: 'get old', content: '0' });
  };

  async connectToChat(chatId: number, redirect = true) {
    await withLoader(
      async () =>
        await withTryCatch(async () => {
          this.disconnectChat();

          const data = await ChatApi.getChatTokens(chatId);
          const token = data?.token;
          const userId = store.state.user?.id;
          if (!token || !userId) return;

          this._websocket.on(WSTransportEvents.Connected, this._onOpen);
          this._websocket.on(WSTransportEvents.Message, this._onMsg);

          await this._websocket.connect(`chats/${userId}/${chatId}/${token}`);
          this.isConnected = true;

          const users = await ChatApi.getChatUsers(chatId);

          chatStore.set('activeChat.chatUsers', users);
          chatStore.set('activeChat.chatId', chatId);

          if (redirect) {
            new Router().push(`/${LinksPages.chat}/${chatId}`);
          }
        }),
    );
  }

  async searchUser(loginPart?: string) {
    if (!loginPart) return;

    return await withTryCatch(async () => await ChatApi.searchUser(loginPart));
  }

  async addUsersToChat(data: RequestAddUsersToChat) {
    await withLoader(
      async () =>
        await withTryCatch(async () => {
          await ChatApi.addUsersToChat(data);
          const users = await ChatApi.getChatUsers(data.chatId);
          chatStore.set('activeChat.chatUsers', users);
        }),
    );
  }

  async deleteUsersFromChat(data: RequestDeleteUsersFromChat) {
    await withLoader(
      async () =>
        await withTryCatch(async () => {
          await ChatApi.deleteUsersFromChat(data);
          const users = await ChatApi.getChatUsers(data.chatId);
          chatStore.set('activeChat.chatUsers', users);
        }),
    );
  }

  disconnectChat() {
    this._websocket.off(WSTransportEvents.Message, this._onMsg);
    this._websocket.off(WSTransportEvents.Connected, this._onOpen);
    this._websocket.close();
    this.isConnected = false;

    chatStore.set('activeChat.messages', []);
  }

  onSubmit = ({ message }: { message: string }) => {
    this._websocket.send({ type: 'message', content: message });
  };
}

export const ChatController = new ChatControllerCrt();
