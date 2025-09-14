import type { Props } from '@common/Block/types';
import type { IStore } from '@store/types';

import { StoreEvents } from '../EventStore';
import { store } from '../store';

type WithRender = { render(): string };

type RequiredPublicBits<P> = {
  setProps(next: Partial<P>): void;
  forceUpdate(props: P): void;
  destroy(): void;
} & WithRender;

type IComponent = new (...args: any[]) => RequiredPublicBits<unknown>;

type MapStateToProps = (store: IStore) => Partial<Props> | null;

export function connect<
  // не abstract, экземпляр обязан иметь setProps/destroy/render
  C extends IComponent,
>(
  Component: C,
  mapStateToProps: MapStateToProps,
  getState: () => IStore = () => store.state,
  subscribe: (cb: () => void) => void | (() => void) = (cb) => store.on?.(StoreEvents.Updated, cb),
) {
  type A = ConstructorParameters<C>;
  type Inst = InstanceType<C>;

  class Connected extends Component {
    constructor(...args: any[]) {
      super(...(args as A));

      const setProps = () => {
        const state = getState();
        if (!state) return;
        const props = mapStateToProps(state);
        if (!!props) this.setProps(props);
      };

      /** Необходимо при переходе по страницам, чтобы подтянулся актуальный стор */
      setProps();

      subscribe(() => {
        setProps();
      });
    }
  }

  return Connected as unknown as new (...args: A) => Inst;
}
