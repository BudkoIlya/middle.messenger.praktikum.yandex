import { ChatApi } from '@api/ChatApi';
import { store } from '@store';
import { withTryCatch } from '@utils/withTryCatch';

import { BaseController } from '../BaseController';

class ChatControllerCrt extends BaseController {
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
}

export const ChatController = new ChatControllerCrt();
