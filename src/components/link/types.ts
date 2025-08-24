import type { Events } from '../../common/Block/types';

export interface ILink {
  className?: string;
  id?: string;
  path: string;
  events?: Events;
  value?: string;
  text?: string;
  [key: string]: unknown;
}
