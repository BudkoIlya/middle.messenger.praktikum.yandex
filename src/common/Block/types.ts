import type { Block } from '@src/common';

export type EventsMap = Record<string, EventListener>;

export type BlockEvents<P> = {
  init: [];
  'flow:component-did-mount': [];
  'flow:component-did-update': [oldProps: P, newProps: P];
  'flow:render': [];
  'flow:rendered': [];
};

export type Events = Record<string, EventListener>;

export type Props = {
  events?: Events;
  styles?: CSSModuleClasses | string;
  [key: string]: unknown | Block;
};
