import { HandlebarsRegister } from '../../common/HandlebarsRegistration';
import { type ElementsKeys, type IItem } from '../../common/HandlebarsRegistration/types';
import type { Components, Pages } from './types';
import { Links } from '../../components/header/scripts/contants';
import { COMPONENT_STYLES, COMPONENTS_BY_KEY, PAGE_BY_LINK, PAGE_STYLES } from './constants';

export class HandlePages extends HandlebarsRegister {
  private _page: Pages | null = null;

  private _loadedComponentStyles = new Set<ElementsKeys>();

  private _loadedPageStyles = new Set<Links>();

  constructor() {
    super();
    this.setLink(Links.homepage); // Открытие страницы по умолчанию
  }

  private async _loadStyles(link: Links, components?: Components[] | null): Promise<void> {
    if (!this._loadedPageStyles.has(link)) {
      await PAGE_STYLES[link]();
    }

    if (components) {
      await Promise.all(
        components.map(async (key) => {
          if (!!COMPONENT_STYLES[key] && !this._loadedComponentStyles.has(key)) {
            await COMPONENT_STYLES[key]();
            this._loadedComponentStyles.add(key);
          }
        }),
      );
    }
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

    await this._loadStyles(link, components);

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
