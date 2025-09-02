import type { Events } from '@common/Block/types';

export interface ILink {
  path: string;
  events?: Events;
  value?: string;
  text?: string;
  className?: string;
  [key: string]: unknown;
}
