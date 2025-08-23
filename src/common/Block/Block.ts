import Handlebars from 'handlebars';

import { EventBus } from '../EvenBus';
import { createProxy } from '../Proxy';
import type { BaseBlock, Props } from './types';

//TODO: разобраться как монтировать теперь компоненты и преобразовывать это всё в один шаблон

export abstract class Block implements BaseBlock {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;

  private _meta: { tagName: string; props: Props };

  private _eventBus: EventBus;

  props: Props;

  private _isUpdated = false;

  protected constructor(tagName: string = 'div', props: Props) {
    const eventBus = new EventBus();
    this._eventBus = eventBus;
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

  private _render() {
    // const fragment = this._compile(this.render(), this.props.props);
    //
    // console.log('[RENDER] fragment children:', fragment.childNodes.length);
    // if (!this._element) {
    //   return;
    // }
    //
    // this._element.innerHTML = '';
    // this._element.append(...Array.from(fragment.childNodes));
    //
    // console.log('[RENDER] root after fill:', this._element.outerHTML);
    // console.log({ child: this.props.children });
    //
    // this.props.children?.forEach(({ item }) => {
    //   const content = item.getContent();
    //
    //   console.log({ content: content?.innerHTML });
    //
    //   if (content) {
    //     this._element!.append(content);
    //   }
    // });
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
