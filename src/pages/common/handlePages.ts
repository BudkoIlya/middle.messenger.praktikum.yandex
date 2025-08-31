import { HandlebarsRegister } from '@common';
import { Links } from '@components/header/scripts/contants';
import type { IItem } from '@common/HandlebarsRegistration/types';

import { COMPONENTS_BY_KEY, PAGE_BY_LINK } from './constants';
import type { Components, Pages } from './types';

export class HandlePages extends HandlebarsRegister {
  private _page: Pages | null = null;

  constructor() {
    super();
    const currentPath = window.location.pathname.replace('/', '') as Links;
    this.setLink(currentPath || Links.homepage); // Открытие страницы по умолчанию
  }

  private _registerComponents(components: Components[]) {
    const items = components.map<IItem>((key) => ({ key, template: COMPONENTS_BY_KEY[key] }));
    this.register(items);
  }

  async setLink(link: Links) {
    if (this._page) {
      this._destroy();
    }

    const { createPage, components } = PAGE_BY_LINK[link]?.() || {};

    if (components) {
      this._registerComponents(components);
    }

    this._page = createPage();
    this._page?.mount('#main');
  }

  private _destroy() {
    this.unRegister();
    this._page?.unmount();
    this._page = null;
  }
}
