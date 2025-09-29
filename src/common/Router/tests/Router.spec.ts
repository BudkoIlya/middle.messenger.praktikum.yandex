import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@utils', async () => {
  const actual = await vi.importActual<typeof import('@utils')>('@utils');
  return {
    ...actual,
    withLoader: <T>(run: () => Promise<T>) => run(),
  };
});

import { Block } from '@src/common';

import { Router } from '../Router';

// Минимальная реализация Block, которую использует Route внутри Router
class BlockA extends Block {
  render(): string {
    return `<div></div>`;
  }

  static last?: BlockA;

  constructor() {
    super('div', {});
    BlockA.last = this;
  }

  mount = vi.fn();

  afterRender = vi.fn();

  forceUpdate = vi.fn();

  unmount = vi.fn();
}

class BlockB extends Block {
  static last?: BlockB;

  constructor() {
    super('div', {});
    BlockB.last = this;
  }

  render(): string {
    return `<div></div>`;
  }

  mount = vi.fn();

  afterRender = vi.fn();

  forceUpdate = vi.fn();

  unmount = vi.fn();
}

// Сброс __instance для каждого теста
function resetRouterSingleton() {
  // @ts-expect-error runtime reset
  Router.__instance = undefined;
}

function makeRouterWithTwoRoutes() {
  const router = new Router();
  router.use('/a', BlockA);
  router.use('/b', BlockB);
  return router;
}

describe('Router', () => {
  beforeEach(() => {
    resetRouterSingleton();

    window.history.replaceState({}, '', '/');
    window.onpopstate = null;

    const existing = document.querySelector('#main');
    if (!existing) {
      const main = document.createElement('div');
      main.id = 'main';
      document.body.appendChild(main);
    }

    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('start(): монтирует текущий маршрут и вызывает afterRender', () => {
    const router = new Router();
    router.use('/home', BlockA);

    window.history.replaceState({}, '', '/home?x=1');
    router.start();

    // forceUpdate не должен вызываться на первом рендере
    expect.soft(BlockA.last?.forceUpdate).not.toHaveBeenCalled();
    expect(BlockA.last?.afterRender).toHaveBeenCalledTimes(1);
  });

  it('push() того же маршрута с тем же query повторно вызывает render (mount+afterRender)', () => {
    const router = new Router();
    router.use('/a', BlockA);

    window.history.replaceState({}, '', '/a?x=1');
    router.start();

    router.push('/a?x=1');

    expect(BlockA.last?.mount).toHaveBeenCalledTimes(2);
  });

  it('push() того же маршрута с новым query вызывает forceUpdate без повторного mount', () => {
    const router = new Router();
    router.use('/a', BlockA);

    window.history.replaceState({}, '', '/a?x=1');
    router.start();

    router.push('/a?x=2');

    expect(BlockA.last?.mount).toHaveBeenCalledTimes(1);
  });

  it('переход на другой маршрут вызывает unmount у прошлого и mount у нового', () => {
    const router = makeRouterWithTwoRoutes();

    window.history.replaceState({}, '', '/a');

    router.start();
    router.push('/b');

    expect(BlockA.last?.unmount).toHaveBeenCalledTimes(1);
    expect(BlockB.last?.mount).toHaveBeenCalledTimes(1);
  });

  it('getRoute() находит подходящий маршрут', () => {
    const router = makeRouterWithTwoRoutes();
    const r1 = router.getRoute('/a');
    const r2 = router.getRoute('/b?y=2');
    const rNone = router.getRoute('/c');

    expect(r1).toBeTruthy();
    expect(r2).toBeTruthy();
    expect(rNone).toBeUndefined();
  });

  it('back() проксируют вызовы в history', () => {
    const backSpy = vi.spyOn(window.history, 'back');

    const router = new Router();

    router.back();

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('forward() проксируют вызовы в history', () => {
    const fwdSpy = vi.spyOn(window.history, 'forward');

    const router = new Router();

    router.forward();

    expect(fwdSpy).toHaveBeenCalledTimes(1);
  });
});
