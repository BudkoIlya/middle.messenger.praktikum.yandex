import Handlebars from 'handlebars';

import type { IMountBlock, IItem } from './types';

export class HandlebarsRegister {
  items: IMountBlock = new Map();

  private _setItems(items?: IItem[]) {
    items?.forEach(({ key, template }) => {
      if (this.items.has(key)) return;
      this.items.set(key, template);
    });
  }

  constructor(items?: IItem[]) {
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
