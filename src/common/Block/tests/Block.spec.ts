import { describe, expect, it, vi } from 'vitest';

import { Block } from '@src/common';
import type { Props } from '@common/Block/types';

class TestBlock extends Block<{ text: string; afterRender?: () => void }> {
  constructor(tag: string = 'div', props: { text: string; afterRender?: () => void }) {
    super(tag, props);
  }

  afterRender(): void {
    this.props.afterRender?.();
  }

  render(): string {
    return `<div><span data-testid="txt">{{text}}</span></div>`;
  }
}

class RootlessButton extends Block {
  constructor(tag: string = '', props: Props) {
    super(tag, props);
  }

  render(): string {
    return `<button data-testid="btn">{{label}}</button>`;
  }
}

class ChildBlock extends Block {
  mounted = false;

  constructor(tag: string = '', props: { text: string }) {
    super(tag, props);
  }

  override componentDidMount(): void {
    this.mounted = true;
  }

  render(): string {
    return `<div data-testid="child">{{text}}</div>`;
  }
}

class ParentWithChild extends Block<Props & { child: ChildBlock }> {
  constructor(tag = '', props: { child: ChildBlock }) {
    super(tag, props);
  }

  render(): string {
    return `<div data-testid="parent">{{{child}}}</div>`;
  }
}

class SpyBlock extends TestBlock {
  compDidUpdateSpy = vi.fn();

  componentDidUpdate(o: unknown, n: unknown): boolean {
    this.compDidUpdateSpy(o, n);
    return true;
  }
}

describe('Block methods', () => {
  it('Рендерим содержимое в режиме с корневым тегом', () => {
    const block = new TestBlock('div', { text: 'Hello' });
    const el = block.getContent();
    expect.soft(el).toBeInstanceOf(HTMLElement);

    const txt = el?.querySelector('[data-testid="txt"]')!;
    expect.soft(txt).toBeTruthy();
    expect(txt.textContent).toBe('Hello');
  });

  it('Rootless режим', () => {
    const button = new RootlessButton('', { label: 'Click' });
    const first = button.getContent();
    expect.soft(first).toBeInstanceOf(HTMLElement);
    expect.soft(first?.tagName?.toLowerCase()).toBe('button');
    expect.soft(first?.textContent).toBe('Click');

    button.setProps({ label: 'Next' });
    const second = button.getContent();
    expect.soft(second).not.toBe(first);
    expect(second?.textContent).toBe('Next');
  });

  it('Встраивает дочерний Block', () => {
    const child = new ChildBlock('div', { text: 'I am child' });
    const parent = new ParentWithChild('div', { child });

    const parentEl = parent.getContent();
    const injected = parentEl?.querySelector('[data-testid="child"]');
    expect.soft(injected).toBeTruthy();
    expect.soft(injected?.tagName.toLowerCase()).toBe('div');
    expect.soft(injected?.textContent).toBe('I am child');

    expect(child.mounted).toBe(true);
  });

  it('Обновление пропсов Block.setProps', () => {
    const block = new TestBlock('div', { text: 'Hello' });
    let txt = block.getContent()?.querySelector('[data-testid="txt"]')!;
    expect.soft(txt.textContent).toBe('Hello');

    block.setProps({ text: 'World' });
    txt = block.getContent()?.querySelector('[data-testid="txt"]')!;
    expect(txt.textContent).toBe('World');
  });

  it('Навешивает события и снятие их при повторном рендере', () => {
    const onClick = vi.fn();
    const block = new RootlessButton('', {
      label: 'Press',
      events: { click: onClick },
    });

    const btn = block.getContent();
    btn?.dispatchEvent(new MouseEvent('click'));

    block.setProps({ label: 'Again' });
    const btn2 = block.getContent();

    btn2?.dispatchEvent(new MouseEvent('click'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('Вставляем корень в DOM и триггерим dispatchComponentDidMount у текущего компонента', () => {
    document.body.innerHTML = `<div id="app"></div>`;
    const block = new TestBlock('div', { text: 'Mounted' });

    const spy = vi.spyOn(block, 'dispatchComponentDidMount').mockImplementation(() => {});
    block.mount('#app');

    const host = document.querySelector('#app');
    expect(host?.textContent).toContain('Mounted');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('Вызываем componentDidUpdate при forceUpdate', () => {
    const block = new SpyBlock('div', { text: 'Mounted' });

    block.forceUpdate();

    expect(block.compDidUpdateSpy).toHaveBeenCalledTimes(1);
  });

  it('Вызывается Block.afterRender после рендера, если определён', () => {
    const spy = vi.fn();

    const block = new TestBlock('div', {
      text: 'Hello',
      afterRender() {
        spy();
      },
    });

    block.setProps({ text: 'text' });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
