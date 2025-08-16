import Handlebars from 'handlebars';

import { HandlebarsRegister } from '../../../common/HandlebarsRegistration';
import { ElementsKeys } from '../../../common/HandlebarsRegistration/types';
import { HandlePages } from '../../../pages/common';
import { navigation } from '../template';
import { NAVIGATION_CONTEXT, type Links } from './contants';

export class Navigation extends HandlebarsRegister {
  pages: HandlePages | null = null;

  constructor() {
    super([{ key: ElementsKeys.header, template: navigation }]);
    this.pages = new HandlePages();
  }

  setLinks(link: Links) {
    this.pages?.setLinks(link);
  }

  private _setupRoutListener(element: HTMLElement) {
    window.addEventListener('popstate', () => {
      const currentPath = window.location.pathname;

      const activeLink = element.querySelector(`a[href^="${currentPath}"], button[data-path^="${currentPath}"]`);

      if (activeLink) {
        const id = activeLink.getAttribute('data-id') as Links;
        this.setLinks(id);
      }
    });
  }

  mount = () => {
    const header = document.getElementById('header');
    const navCompTemplate = this.items.get(ElementsKeys.header);

    const navComp = Handlebars.compile(navCompTemplate)(NAVIGATION_CONTEXT);
    if (header && navComp) {
      header.innerHTML = navComp;
      this._setupRoutListener(header);

      header.querySelectorAll('a[data-id]').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const path = link.getAttribute('href') || '/';
          history.pushState({ page: path }, path, path);
          window.dispatchEvent(new PopStateEvent('popstate', { state: { page: path } }));
        });
      });
    }
  };
}
