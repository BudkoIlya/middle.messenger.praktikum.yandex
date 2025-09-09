import { matchesPath } from '@common/Router/utils';
import type { Block } from '@common';
import type { Props } from '@common/Block/types';

export type BlockConstructor<P extends Props = Props> = new () => Block<P>;

class Route {
  private readonly _view?: Block;

  private readonly _pattern: string;

  private _lastQuery = '';

  constructor(pattern: string, view: BlockConstructor) {
    this._pattern = pattern;
    this._view = new view();
  }

  match(pathname: string) {
    return matchesPath(pathname, this._pattern);
  }

  navigate(pathname: string) {
    const [pathPart = '', queryPart = ''] = pathname.split('?');

    const isSameRoute = this.match(pathPart);
    if (isSameRoute && (!this._lastQuery || this._lastQuery === queryPart)) {
      this._lastQuery = queryPart;
      this._render();
      return;
    }

    if (isSameRoute && this._lastQuery !== queryPart) {
      this._lastQuery = queryPart;
      const view = this._view;
      if (view) view.forceUpdate(view.props);
    }
  }

  leave() {
    if (!this._view) return;
    this._lastQuery = '';
    this._view.unmount();
  }

  private _render() {
    if (!this._view) return;
    this._view.mount('#main');
  }
}

export class Router {
  routes: Route[] = [];

  history: History = window.history;

  private _currentRoute?: Route;

  private static __instance: Router;

  constructor() {
    if (Router.__instance) return Router.__instance;
    Router.__instance = this;
  }

  use(pattern: string, block: BlockConstructor) {
    const route = new Route(pattern, block);
    this.routes.push(route);
    return this;
  }

  start() {
    const full = () => window.location.pathname + window.location.search;

    window.onpopstate = () => this._onRoute(full());
    this._onRoute(full());
  }

  private _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) return;

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.navigate(pathname);
  }

  push(pathname: string) {
    this.history?.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history?.back();
  }

  forward() {
    this.history?.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}
