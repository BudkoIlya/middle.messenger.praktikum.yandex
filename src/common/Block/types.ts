import type { Block } from './Block';

export interface BaseBlock {
  getContent(): HTMLElement | null;
  mount(selector: string): void;
  unmount(): void;
}

// export type Child = {
//   item: BaseBlock;
//   children?: Child[];
// };

export type Props = {
  // props: T | Block<Record<string, unknown>>;
  [key: string]: {
    [key: string]: unknown | Block;
  };
  // item?: BaseBlock;
  // children?: Child[];
};
