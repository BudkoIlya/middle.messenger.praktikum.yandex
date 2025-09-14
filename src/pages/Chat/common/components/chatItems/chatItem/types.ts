export interface IChatItem {
  class?: string;
  title: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: string;
  id: number;
  [key: string]: unknown;
}
