import type { Template } from 'handlebars';

export enum ElementsKeys {
  header = 'header',
  input = 'input',
  button = 'button',
  img = 'img',
}

export type IMountBlock = Map<ElementsKeys, Template<unknown>>;

export interface IItem {
  key: ElementsKeys;
  template: Template<unknown>;
}
