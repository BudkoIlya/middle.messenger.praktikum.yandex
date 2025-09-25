import { Block, loading } from '@common';

import styles from './loaderOverlay.module.scss';

export class LoaderOverlay extends Block {
  private unsubscribe?: () => void;

  constructor() {
    super('div', { visible: false, styles });
  }

  componentDidMount() {
    // Подписка: как только loading виден — обновляем пропсы
    this.unsubscribe = loading.subscribe((visible) => this.setProps({ visible }));
  }

  unmount(): void {
    super.unmount();
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  render(): string {
    const { visible } = this.props as { visible: boolean };
    const classes = [styles.overlay, !visible && styles.hidden].filter(Boolean).join(' ');
    return `
      <div class="${classes}">
        <div class="${styles.spinner}" role="status" aria-label="Загрузка"></div>
      </div>
    `;
  }
}
