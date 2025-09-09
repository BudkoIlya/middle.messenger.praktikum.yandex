import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { Router } from '@common/Router';
import { connect } from '@store';
import type { BlockConstructor } from '@common/Router/Router';

import navigation from '../template/navigation.hbs';
import { getNavigationProps, Routers } from './contants';
import type { NavigationProps } from './types';

// Необходимо чтобы не срабатывала дефолтная перезагрузка страницы при клике на ссылку
export function enableNavigation(router: Router, rootSelector = 'header') {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  root.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a) return;

    const url = new URL(a.href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    const current = window.location.pathname + window.location.search;
    const next = url.pathname + url.search;
    if (current === next) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    router.push(next);
  });
}

class NavigationCrt extends Block<NavigationProps> {
  private _router = new Router();

  constructor() {
    super('', getNavigationProps(null), [{ key: ElementsKeys.header, template: navigation }]);
  }

  dispatchComponentDidMount() {
    const regArr = (routes: { path: string; component: BlockConstructor }[]) => {
      routes.forEach(({ path, component }) => {
        this._router.use(path, component);
      });
    };

    Object.values(Routers).forEach((route) => {
      if (Array.isArray(route)) regArr(route);
      else {
        this._router.use(route.path, route.component);
      }
    });

    this._router.start();
    enableNavigation(this._router);
    super.dispatchComponentDidMount();
  }

  // componentDidUpdate(old, next) {
  //   console.log({ old, next });
  //   return true;
  // }

  render(): string {
    return navigation;
  }
}

export const Navigation = connect(NavigationCrt, (store) => getNavigationProps(store.user));
