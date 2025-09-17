import type { IChat } from '@store/ChatStore/types';
import type { IUser } from '@store/UserStore/types';

import { ChatStore } from './ChatStore';
import { UserStore } from './UserStore';
import type { IStore } from './types';

import { EventStore, StoreEvents } from 'src/store/EventStore';

type SlicePublic<T extends object = object> = Pick<EventStore<T>, 'set' | 'merge' | 'clear'>;

const hideState = <T extends object>(s: EventStore<T>): SlicePublic<T> =>
  new Proxy(s, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
  }) as SlicePublic<T>;

const _chatStore = new ChatStore();
const _userStore = new UserStore();

class Store extends EventStore<IStore> {
  constructor() {
    super({
      user: _userStore.state,
      chat: _chatStore.state,
    });

    const rebound = () => {
      this.updateStore();
    };

    _userStore.on(StoreEvents.Updated, rebound);
    _chatStore.on(StoreEvents.Updated, rebound);
  }
}

export const store = new Store();
export const chatStore: SlicePublic<IChat> = hideState(_chatStore);
export const userStore: SlicePublic<IUser> = hideState(_userStore);
