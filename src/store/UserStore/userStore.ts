import type { IUser } from '@api/LoginApi';

import { EventStore } from 'src/store/EventStore';

class UserStore extends EventStore<IUser> {
  protected _store: IUser = null;
}

export const userStore = new UserStore();
