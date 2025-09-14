import type { IUser } from '@api/AuthApi';
import type { IChat } from '@api/ChatApi';

export interface IStore {
  user: IUser;
  chat: IChat;
}
