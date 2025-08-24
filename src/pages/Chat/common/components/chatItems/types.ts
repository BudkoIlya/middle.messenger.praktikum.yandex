import type { IChatItem } from './chatItem';

export interface IChatItems {
  id: string;
  path: string;
  class?: string;
  chatItems: IChatItem[];
}
