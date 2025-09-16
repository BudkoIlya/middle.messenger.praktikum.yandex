export interface IChatItem {
  class?: string;
  title: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  id: number;
  [key: string]: unknown;
}
