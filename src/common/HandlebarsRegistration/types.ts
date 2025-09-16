import type { Template } from 'handlebars';

import type { LinksPages } from '@common/Router/PathConfig';

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

export type IMountBlock = Map<ElementsKeys | LinksPages, Template<unknown>>;

export interface IItem {
  key: ElementsKeys | LinksPages;
  template: Template<unknown>;
}
