import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { Router } from '@common/Router';
import type { BlockConstructor } from '@common/Router/Router';

import navigation from '../template/navigation.hbs';
import { NAVIGATION_CONTEXT, Routers } from './contants';

export class Navigation extends Block {
  private _router = new Router();

  constructor() {
    super('', NAVIGATION_CONTEXT, [{ key: ElementsKeys.header, template: navigation }]);
  }

  dispatchComponentDidMount() {
    const createInnerRoutes = (routes: { path: string; component: BlockConstructor }[]) => {
      routes.forEach(({ path, component }) => {
        this._router.use(path, component);
      });
    };

    Object.values(Routers).forEach((route) => {
      if (Array.isArray(route)) {
        createInnerRoutes(route);
      } else {
        this._router.use(route.path, route.component);
      }
    });

    super.dispatchComponentDidMount();
    this._router.start();
  }

  render(): string {
    return navigation;
  }
}
