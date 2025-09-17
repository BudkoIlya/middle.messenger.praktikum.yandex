import { Block } from '@common';
import { withLoader } from '@src/utils/withLoader';
import type { BlockConstructor } from '@common/Router/Router';
import type { ComponentLoader } from '@components/header/scripts';
import type { AnyObject } from '@src/utils/types';

type MakeLazyOptions = { keepAlive?: boolean; showLoaderOnFirstImport?: boolean };

export const makeLazyComponent = function (loader: ComponentLoader, opts: MakeLazyOptions = {}): BlockConstructor {
  const { keepAlive = true, showLoaderOnFirstImport = true } = opts;

  return class LazyPage extends Block {
    private static kept: Block | null = null;

    private static ctorP?: Promise<BlockConstructor>;

    private _page: Block | null = null;

    private pendingProps?: AnyObject;

    private readonly _args: unknown[];

    constructor(...args: unknown[]) {
      super('', {}, []);
      this._args = args;

      this.setProps = (next) => {
        const page = this.page;
        if (page) {
          page.setProps(next);
        } else {
          this.pendingProps = { ...(this.pendingProps ?? {}), ...next };
        }
      };

      this.forceUpdate = () => {
        const page = this.page;
        if (page?.forceUpdate) page.forceUpdate();
      };
    }

    get page(): Block | null {
      return keepAlive ? (this.constructor as typeof LazyPage).kept : this._page;
    }

    set page(v: Block | null) {
      if (keepAlive) (this.constructor as typeof LazyPage).kept = v;
      else this._page = v;
    }

    getContent = (): HTMLElement | null => this.page?.getContent() ?? super.getContent();

    static getCtor(): Promise<BlockConstructor> {
      if (!this.ctorP) {
        const load = async () => (await loader()).default;
        this.ctorP = showLoaderOnFirstImport ? withLoader(load) : load();
      }
      return this.ctorP;
    }

    componentDidMount = async () => {
      const host = super.getContent();
      if (!host) return;

      if (keepAlive && this.page) {
        const el = this.page.getContent();
        if (el && el !== host) host.replaceWith(el);
        this.page.dispatchComponentDidMount?.();
        return;
      }

      const Ctor = await (this.constructor as typeof LazyPage).getCtor();
      const page = new Ctor(...(this._args as []));
      this.page = page;

      if (this.pendingProps) {
        page.setProps(this.pendingProps);
        this.pendingProps = undefined;
      }

      const el = page.getContent();
      if (el) host.replaceWith(el);
      page.dispatchComponentDidMount?.();
    };

    mount = (selector: string) => {
      const page = this.page;
      if (page?.mount) page?.mount(selector);
      super.mount?.(selector);
    };

    unmount = () => {
      if (this.page) {
        this.page.unmount();
        return;
      }
      super.unmount();
    };

    render() {
      return `<div></div>`;
    }

    afterRender = () => {
      const page = this.page;
      if (page?.afterRender) page.afterRender();
      super.afterRender?.();
    };

    destroy = (): void => {
      if (!keepAlive) this.page?.destroy();
      if (!keepAlive) this.page = null;
      super.destroy?.();
    };
  };
};
