import { userStore } from './UserStore';
import type { IStore } from './types';

import { EventStore } from 'src/store/EventStore';

class Store extends EventStore<IStore> {
  /** сюда добавляются все сторы */
  store = {
    user: userStore.store,
  };
}

export const store = new Store();
