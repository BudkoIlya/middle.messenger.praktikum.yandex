import type { Block } from '../../common/Block';

export interface IButton {
  text: string | Block;
  type?: HTMLButtonElement['type'];
  className?: string;
  id?: string;
  path?: string;
  name?: string;
  [key: string]: unknown;
}
