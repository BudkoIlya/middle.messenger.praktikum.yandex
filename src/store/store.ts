import { chatStore } from './ChatStore';
import { userStore } from './UserStore';
import type { IStore } from './types';

import { EventStore } from 'src/store/EventStore';

class Store extends EventStore<IStore> {
  /** сюда добавляются все сторы */

  protected _store = {
    user: userStore.state,
    chat: chatStore.state,
  };
}

export const store = new Store();
