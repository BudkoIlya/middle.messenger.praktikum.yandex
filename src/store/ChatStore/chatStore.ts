import type { IChat } from './types';

import { EventStore } from 'src/store/EventStore';

export class ChatStore extends EventStore<IChat> {
  constructor() {
    super({});
  }
}
