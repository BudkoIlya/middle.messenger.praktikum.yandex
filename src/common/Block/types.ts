import type { Block } from './Block';

export type Events = Record<string, EventListener>;

export type Props = {
  events?: Events;
  styles?: CSSModuleClasses | string;
  [key: string]: unknown | Block;
};
