import type { IUser } from '@api/AuthApi';

import { EventStore } from 'src/store/EventStore';

export class UserStore extends EventStore<IUser> {
  constructor() {
    super({} as IUser);
  }
}
