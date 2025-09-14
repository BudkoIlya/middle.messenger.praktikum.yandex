import type { IChat } from '@api/ChatApi';

import { EventStore } from 'src/store/EventStore';

class ChatStore extends EventStore<IChat> {
  protected _store: IChat = null;
}

export const chatStore = new ChatStore();
