import type { IChatItem } from './chatItem';

export interface IChatItems {
  path: string;
  class?: string;
  chatItems: IChatItem[];
}
