import type { Block } from '@common';
import type { Props } from '@common/Block/types';

export interface IButton<Child extends Block = Block> extends Props {
  text: string | Child | Child[];
  type?: HTMLButtonElement['type'];
  className?: string;
  path?: string;
  name?: string;
  theme?: 'default' | null;
}
