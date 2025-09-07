import type { IUser } from '@api/LoginApi';

import { EventStore } from 'src/store/EventStore';

class UserStore extends EventStore<IUser | null> {
  store: IUser | null = null;
}

export const userStore = new UserStore();
