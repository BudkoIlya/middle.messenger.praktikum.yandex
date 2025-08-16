import { EventBus } from '../EvenBus';
import { createProxy } from '../Proxy';

export type Props = Record<string, unknown>;

export abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;

  private readonly _meta: { tagName: string; props: Props };

  private _eventBus: EventBus;

  props: Props;

  private _isUpdated: boolean = false;

  protected constructor(tagName: string = 'div', props: Props = {}) {
    const eventBus = new EventBus();
    this._meta = { tagName, props };
    this._eventBus = eventBus;
    this.props = this._makePropsProxy(props, this.setIsUpdated);

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT); // рендер компонента
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private init() {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount?.();
  }

  protected componentDidMount?(): void;

  dispatchComponentDidMount() {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props) {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(_oldProps: Props, _newProps: Props) {
    return true;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) return;

    const oldValue = { ...this.props };

    if (this._isUpdated) {
      this._eventBus.emit(Block.EVENTS.INIT, oldValue, this.props);
      this._isUpdated = false;
    }
    Object.assign(this.props, nextProps);
  };

  setIsUpdated(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render() {
    const block = this.render();
    if (this._element) {
      this._element.innerHTML = block;
    }
  }

  protected abstract render(): string;

  getContent(): HTMLElement | null {
    return this.element;
  }

  mount(selector: string) {
    const root = document.querySelector(selector);
    const content = this.getContent();
    if (content && root) {
      root.replaceChildren(content);
      this.dispatchComponentDidMount();
    }
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private _makePropsProxy = (props: Props, setIsUpdated: (value: boolean) => void): Props =>
    createProxy(props, setIsUpdated);
}
