import type { Block } from '@common';
import type { Events } from '@common/Block/types';

export interface IButton {
  text: string | Block | Block[];
  type?: HTMLButtonElement['type'];
  className?: string;
  path?: string;
  name?: string;
  events?: Events;
  styles?: CSSModuleClasses;
  theme?: 'default' | null;
  [key: string]: unknown;
}
