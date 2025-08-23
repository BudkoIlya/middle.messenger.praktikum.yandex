import type { Block } from './Block';

export interface BaseBlock {
  getContent(): HTMLElement | null;
  mount(selector: string): void;
  unmount(): void;
}

export type Props = {
  [key: string]: unknown | Block;
};
