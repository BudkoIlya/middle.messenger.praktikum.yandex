import type { IUser } from '@api/LoginApi';

export interface IStore {
  user: IUser | null;
}
