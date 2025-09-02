import Handlebars from 'handlebars';

import type { IItem, IMountBlock } from './types';

Handlebars.registerHelper('eq', (a, b) => a === b);

export class HandlebarsRegister {
  private static __instance: HandlebarsRegister;

  items: IMountBlock = new Map();

  private _setItems(items?: IItem[]) {
    items?.forEach(({ key, template }) => {
      if (this.items.has(key)) return;
      this.items.set(key, template);
    });
  }

  constructor(items?: IItem[]) {
    if (HandlebarsRegister.__instance) return HandlebarsRegister.__instance;
    HandlebarsRegister.__instance = this;

    this._setItems(items);
  }

  register = (items?: IItem[]) => {
    if (items) {
      this._setItems(items);
    }
    this.items.forEach((template, key) => {
      if (!template) return;
      Handlebars.registerPartial(key, template);
    });
  };

  unRegister = () => {
    this.items.forEach((_t, key) => {
      Handlebars.unregisterPartial(key);
      this.items.delete(key);
    });
  };
}
