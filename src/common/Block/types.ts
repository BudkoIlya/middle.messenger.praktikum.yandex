export interface BaseBlock {
  getContent(): HTMLElement | null;
  mount(selector: string): void;
  unmount(): void;
  // dispatchComponentDidMount(): void;
  // componentDidMount?():void
  // render(): string
}

export type Child = {
  item: BaseBlock;
  children?: Child[];
};

export type Props<T extends Record<string, unknown>> = {
  props: T;
  item?: BaseBlock;
  children?: Child[];
};
