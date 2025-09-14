import type { IChat } from '@api/ChatApi';

import { EventStore } from 'src/store/EventStore';

export class ChatStore extends EventStore<IChat> {
  constructor() {
    super({});
  }
}
