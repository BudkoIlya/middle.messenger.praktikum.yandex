import type { IChat } from '@api/ChatApi';
import type { IUser } from '@api/LoginApi';

export interface IStore {
  user: IUser;
  chat: IChat;
}
