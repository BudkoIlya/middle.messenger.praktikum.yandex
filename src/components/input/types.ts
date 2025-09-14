import type { Block } from '@common';
import type { Events } from '@common/Block/types';

export interface IInput {
  title?: string;
  name: string;
  disabled?: string;
  accept?: string;
  type?: HTMLInputElement['type'];
  class?: string;
  placeholder?: string;
  value?: string;
  events?: Events;
  styles?: CSSModuleClasses;
  label?: string | Block;
  helpTextClass?: string;
  [key: string]: unknown;
}
