import type { IChat } from '@store/ChatStore/types';
import type { IUser } from '@store/UserStore/types';

export interface IStore {
  user: IUser;
  chat: IChat;
}
