import type { Template } from 'handlebars';

export enum ElementsKeys {
  //Навигация
  header = 'header',
  // Общие компоненты
  input = 'input',
  button = 'button',
  img = 'img',
  // Компоненты чата
  chatItem = 'chatItem',
  chatItems = 'chatItems',
  message = 'message',
}

export type IMountBlock = Map<ElementsKeys, Template<unknown>>;

export interface IItem {
  key: ElementsKeys;
  template: Template<unknown>;
}
