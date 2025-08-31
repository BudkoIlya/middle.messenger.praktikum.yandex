import type { Events } from '@common/Block/types';

export interface ILink {
  id?: string;
  path: string;
  events?: Events;
  value?: string;
  text?: string;
  className?: string;
  [key: string]: unknown;
}
