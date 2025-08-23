import type { IChatItem } from './chatItem';

export interface IChatItems extends Record<string, unknown> {
  id: string;
  path: string;
  chatItems: IChatItem[];
}
