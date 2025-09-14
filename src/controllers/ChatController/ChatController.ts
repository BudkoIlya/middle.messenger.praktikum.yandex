import { ChatApi } from '@api/ChatApi';
import { WSTransport } from '@api/WSTrasnsport';
import { store } from '@store';
import { withTryCatch } from '@utils/withTryCatch';
import type { BaseWsMessage } from '@api/WSTrasnsport/WSTransport';

import { BaseController } from '../BaseController';

class ChatControllerCrt extends BaseController {
  private readonly _websocket = new WSTransport<BaseWsMessage<{ message: string }>>();

  async getChats() {
    await withTryCatch(async () => {
      const data = await ChatApi.getChats();
      store.set('chat.chatList', data);
    });
  }

  async createChat(title: string) {
    await withTryCatch(async () => {
      await ChatApi.createChat(title);
      await this.getChats();
    });
  }

  async connectToChat(chatId: string) {
    await withTryCatch(async () => {
      this.disconnectChat();

      const tokens = await ChatApi.connectChat(chatId);

      const token = tokens?.[0]?.token;
      const userId = store.state.user?.id;

      if (!!token && !!userId) {
        await this._websocket.connect(`chats/${userId}/${chatId}/${token}`);
        store.set('chat.token', token);
      }
    });
  }

  disconnectChat() {
    this._websocket.close();
  }
}

export const ChatController = new ChatControllerCrt();
