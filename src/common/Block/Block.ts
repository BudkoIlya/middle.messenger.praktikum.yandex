import Handlebars from 'handlebars';
import { v4 } from 'uuid';

import { EventBus } from '../EvenBus';
import { createProxy } from '../Proxy';
import type { Props } from './types';

type EventsMap = Record<string, EventListener>;

export abstract class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _id: string = v4();

  private _element: HTMLElement | null = null;

  private _meta: { tagName?: string; props: Props };

  private _eventBus: EventBus;

  private _rootless = false;

  private _isUpdated = false;

  private _isDestroyed = false;

  // Храним функцию для снятия всех обработчиков, навешанных последним рендером
  private _removeEvents?: () => void;

  private _onInit = this._init.bind(this);

  private _onCDM = this._componentDidMount.bind(this);

  private _onCDU = this._componentDidUpdate.bind(this);

  private _onRender = this._render.bind(this);

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

  get id(): string {
    return this._id;
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._onInit);
    eventBus.on(Block.EVENTS.FLOW_CDM, this._onCDM);
    eventBus.on(Block.EVENTS.FLOW_CDU, this._onCDU);
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._onRender);
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

  setProps = (nextProps: Props) => {
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

  private _addEvents() {
    const events: EventsMap = (this.props.events || {}) as EventsMap;
    const el = this._element;
    if (!el) return;

    const removers: Array<() => void> = [];

    Object.entries(events).forEach(([event, listener]) => {
      if (typeof listener !== 'function') return;

      el.addEventListener(event, listener);
      removers.push(() => el.removeEventListener(event, listener));
    });

    this._removeEvents = () => removers.forEach((fn) => fn());
  }

  private _removeAllEvents() {
    this._removeEvents?.();
    this._removeEvents = undefined;
  }

  // Превращаем значения пропсов в контекст для шаблона.
  // Вместо outerHTML у детей возвращаем заглушки <div data-block-id="...">
  private _unwrap(value: unknown): unknown {
    if (Array.isArray(value)) {
      const mapped = value.map((item) => this._unwrap(item));
      const isFlat = mapped.every(
        (item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null,
      );
      return isFlat ? mapped.join('') : mapped;
    }

    if (value instanceof Block) {
      return `<div data-block-id="${value.id}"></div>`;
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

  private _forEachChild(value: unknown, cb: (child: Block) => void): void {
    if (Array.isArray(value)) {
      value.forEach((item) => this._forEachChild(item, cb));
    } else if (value instanceof Block) {
      cb(value);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach((item) => this._forEachChild(item, cb));
    }
  }

  private _injectChildren(fragment: DocumentFragment) {
    this._forEachChild(this.props, (child) => {
      const stub = fragment.querySelector(`[data-block-id="${child.id}"]`);
      const node = child.getContent();
      if (stub && node) {
        stub.replaceWith(node);
      }
    });
  }

  private _render() {
    this._removeAllEvents();

    const props = this.props;
    const context = this._prepareContext(props);
    const fragment = this._compile(this.render(), context);

    // Подменяем заглушки реальными DOM-узлами детей до вставки фрагмента
    this._injectChildren(fragment);

    if (this._rootless) {
      const newRoot = fragment.firstElementChild as HTMLElement | null;

      if (!newRoot) {
        this._addEvents();
        return;
      }

      if (!this._element) {
        // первый рендер — просто зафиксировали корень
        this._element = newRoot;
      } else {
        // последующие — заменили старый корень новым
        this._element.replaceWith(newRoot);
        this._element = newRoot;
      }
    } else {
      // обычный режим: элемент уже есть, меняем содержимое
      if (!this._element) return;
      this._element.innerHTML = '';
      this._element.append(...Array.from(fragment.childNodes));
    }

    // Сообщаем детям, что они в дереве
    this._forEachChild(props, (child) => child.dispatchComponentDidMount());

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
    return this._element;
  }

  mount(selector: string) {
    const root = document.querySelector(selector);
    const content = this.getContent();
    if (root && content) {
      root.replaceChildren(content);
      this.dispatchComponentDidMount();
    }
  }

  unmount(): void {
    this._removeAllEvents();
    this._destroy();
  }

  private _cleanupChildren() {
    this._forEachChild(this.props, (child) => child.unmount());
  }

  private _destroy(): void {
    if (this._isDestroyed) return;
    this._isDestroyed = true;

    this._removeAllEvents?.();

    this._cleanupChildren();

    this._element?.remove();

    this._eventBus.off(Block.EVENTS.INIT, this._onInit);
    this._eventBus.off(Block.EVENTS.FLOW_CDM, this._onCDM);
    this._eventBus.off(Block.EVENTS.FLOW_CDU, this._onCDU);
    this._eventBus.off(Block.EVENTS.FLOW_RENDER, this._onRender);

    this._eventBus = null as unknown as EventBus;
    this._element = null;
    this._meta = {} as unknown as { tagName: string; props: Props };
    this.props = {} as unknown as Props;
  }

  private _makePropsProxy = (props: Props, setIsUpdated: (value: boolean) => void): Props =>
    createProxy(props, setIsUpdated);
}
