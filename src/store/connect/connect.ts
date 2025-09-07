import { StoreEvents } from '../EventStore';
import { store } from '../store';

type WithRender = { render(): string };

type RequiredPublicBits<P> = {
  setProps(next: Partial<P>): void;
  destroy(): void;
} & WithRender;

// Props берём из setProps экземпляра
type PropsOfInstance<I> = I extends { setProps(next: infer S): unknown }
  ? S extends Partial<infer Q>
    ? Q
    : never
  : never;

type StoreState = typeof store.state;

export function connect<
  // не abstract, экземпляр обязан иметь setProps/destroy/render
  C extends new (...args: any[]) => RequiredPublicBits<unknown>,
  S = StoreState,
>(
  Component: C,
  mapStateToProps: (state: S) => Partial<PropsOfInstance<InstanceType<C>>>,
  getState: () => S = () => store.state as S,
  subscribe: (cb: () => void) => void | (() => void) = (cb) => store.on?.(StoreEvents.Updated, cb),
) {
  type A = ConstructorParameters<C>;
  type Inst = InstanceType<C>;

  class Connected extends Component {
    private readonly _off?: () => void;

    // Требование TS2545: ровно один rest any[]
    constructor(...args: any[]) {
      super(...(args as A));

      // первичная инициализация
      this.setProps(mapStateToProps(getState()));

      const off = subscribe(() => {
        this.setProps(mapStateToProps(getState()));
      });
      if (typeof off === 'function') this._off = off;
    }

    destroy(): void {
      this._off?.();
      super.destroy();
    }
  }

  return Connected as unknown as new (...args: A) => Inst;
}
