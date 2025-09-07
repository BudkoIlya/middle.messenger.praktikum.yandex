import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { Router } from '@common/Router';
import { isEqual, makeLazyComponent } from '@utils';
import type { IUser } from '@api/LoginApi';

import navigation from '../template/navigation.hbs';
import { getNavigationContext, Routers } from './contants';
import type { ComponentLoader, NavigationProps } from './types';

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

export class Navigation extends Block<NavigationProps> {
  private _router = new Router();

  constructor() {
    super('', getNavigationContext(null), [{ key: ElementsKeys.header, template: navigation }]);
  }

  dispatchComponentDidMount() {
    const regArr = (routes: { path: string; component: ComponentLoader }[]) => {
      routes.forEach(({ path, component }) => {
        this._router.use(path, makeLazyComponent(component));
      });
    };

    Object.values(Routers).forEach((route) => {
      if (Array.isArray(route)) regArr(route);
      else {
        this._router.use(route.path, makeLazyComponent(route.component));
      }
    });

    this._router.start();
    enableNavigation(this._router);
    super.dispatchComponentDidMount();
  }

  componentDidUpdate(oldProps: NavigationProps, newProps: NavigationProps): boolean {
    if (!isEqual<IUser | null>(oldProps.user, newProps.user)) {
      this.setProps(getNavigationContext(newProps.user) as Partial<NavigationProps>);
    }
    return true;
  }

  render(): string {
    return navigation;
  }
}
