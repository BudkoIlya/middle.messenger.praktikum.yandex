import type { Block } from '../../common/Block';
import type { Events } from '../../common/Block/types';

export interface IButton {
  text: string | Block;
  type?: HTMLButtonElement['type'];
  className?: string;
  id?: string;
  path?: string;
  name?: string;
  events?: Events;
  [key: string]: unknown;
}
