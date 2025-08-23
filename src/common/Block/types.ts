import type { Block } from './Block';

export type Events = Record<string, EventListener>;

export type Props = {
  events?: Events;
  [key: string]: unknown | Block;
};
