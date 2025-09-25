import type { Template } from 'handlebars';

export enum ElementsKeys {
  //Навигация
  header = 'header',
  // Общие компоненты
  input = 'input',
  button = 'button',
  img = 'img',
  link = 'link',
  select = 'select',
  // Компоненты чата
  chatItem = 'chatItem',
  chatItems = 'chatItems',
  message = 'message',
}

export type IMountBlock = Map<ElementsKeys | string, Template<unknown>>;

export interface IItem {
  key: ElementsKeys | string;
  template: Template<unknown>;
}
