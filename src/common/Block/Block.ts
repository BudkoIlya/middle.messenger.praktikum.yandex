import Handlebars from 'handlebars';

import { EventBus } from '../EvenBus';
import { createProxy } from '../Proxy';
import type { Props } from './types';

export abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;

  private _meta: { tagName?: string; props: Props };

  private _eventBus: EventBus;

  private _rootless = false;

  private _isUpdated = false;

  props: Props;

  protected constructor(tagName: string = '', props: Props) {
    const eventBus = new EventBus();
    this._eventBus = eventBus;
    this._rootless = !tagName;
    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props, this._setIsUpdated.bind(this));

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const { tagName } = this._meta;
    if (this._rootless || !tagName) return;
    this._element = this._createDocumentElement(tagName);
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private _init() {
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
    if (shouldUpdate) this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidUpdate(_oldProps: Props, _newProps: Props) {
    return true;
  }

  setProps = (nextProps: Partial<Props>) => {
    if (!nextProps) return;
    const oldValue = { ...this.props };
    Object.assign(this.props, nextProps);
    if (this._isUpdated) {
      this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldValue, this.props);
      this._isUpdated = false;
    }
  };

  private _setIsUpdated(isUpdated: boolean) {
    this._isUpdated = isUpdated;
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _addEvents() {
    const events = this.props.events || {};
    const element = this._element;
    if (!element) return;
    Object.entries(events).forEach(([event, listener]) => {
      element.addEventListener(event, listener, true);
    });
  }

  private _removeEvents() {
    const element = this._element;
    if (!element) return;
    const events = this.props.events || {};
    Object.entries(events).forEach(([event, listener]) => {
      element.removeEventListener(event, listener, true);
    });
  }

  private _unwrap(value: unknown): unknown {
    if (Array.isArray(value)) {
      const isFlat = value.every((item) => item instanceof Block || typeof item !== 'object' || item === null);
      const mapped = value.map((item) => this._unwrap(item));
      return isFlat ? mapped.join('') : mapped;
    }

    if (value instanceof Block) {
      return value.getContent()?.outerHTML ?? '';
    }

    if (value && typeof value === 'object') {
      const obj: Record<string, unknown> = {};
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        obj[k] = this._unwrap(v);
      });
      return obj;
    }

    return value;
  }

  private _prepareContext(props: Props): Record<string, unknown> {
    const context: Record<string, unknown> = {};

    Object.entries(props).forEach(([key, value]) => {
      context[key] = this._unwrap(value);
    });

    return context;
  }

  private _recursiveChildren(value: unknown, cb: (child: Block) => void): void {
    if (Array.isArray(value)) {
      value.forEach((item) => this._recursiveChildren(item, cb));
    } else if (value instanceof Block) {
      cb(value);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach((item) => this._recursiveChildren(item, cb));
    }
  }

  private _render() {
    const props = this.props;

    const context = this._prepareContext(props);

    const fragment = this._compile(this.render(), context);

    if (this._rootless) {
      const newRoot = fragment.firstElementChild as HTMLElement | null;

      if (!newRoot) {
        return;
      }

      if (!this._element) {
        // первый рендер — просто зафиксировали корень
        this._element = newRoot;
      } else {
        // последующие — заменили старый корень новым
        this._element.replaceWith(newRoot);
      }
    } else {
      // обычный режим: элемент уже есть, меняем содержимое
      if (!this._element) return;
      this._element.innerHTML = '';
      this._element.append(...Array.from(fragment.childNodes));
    }

    // монтирование детей
    this._recursiveChildren(props, (child) => child.dispatchComponentDidMount());

    // При перерендере удаляем старые эвенты
    this._removeEvents();
    this._addEvents();
  }

  private _compile(template: string, context: Record<string, unknown>): DocumentFragment {
    const tmpl = Handlebars.compile(template);
    const html = tmpl(context || {});
    const temp = document.createElement('template');
    temp.innerHTML = html;

    return temp.content;
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

  unmount(): void {
    this._removeEvents();
    this._destroy();
  }

  private _destroy(): void {
    this._eventBus.off(Block.EVENTS.INIT, this._init.bind(this));
    this._eventBus.off(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    this._eventBus.off(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    this._eventBus.off(Block.EVENTS.FLOW_RENDER, this._render.bind(this));

    this._eventBus = null as unknown as EventBus;
    this._element = null;
    this._meta = {} as unknown as { tagName: string; props: Props };
    this.props = {} as unknown as Props;
  }

  private _makePropsProxy = (props: Props, setIsUpdated: (value: boolean) => void): Props =>
    createProxy(props, setIsUpdated);
}
