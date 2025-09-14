export interface IChatItem {
  class?: string;
  userName: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: string;
  [key: string]: unknown;
}
