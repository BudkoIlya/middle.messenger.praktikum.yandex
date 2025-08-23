import { Block } from '../../../common/Block';
import type { IButton } from '../types';
import button from '../button.hbs';

export class Button extends Block {
  constructor({ className, id, name, type, path, text }: IButton) {
    super('', {});

    const buttonEl = this.getContent();

    if (buttonEl) {
      const attributes = { 'data-id': id, name, type, 'data-path': path, text };

      Object.entries(attributes).forEach(([key, value]) => {
        if (value instanceof Block) return;

        if (key.startsWith('data_') && !!value) {
          const datasetKey = key.replace('data_', '');
          buttonEl.dataset[datasetKey] = value;
        }

        if (!!value) {
          buttonEl.setAttribute(key, value);
        }
      });

      buttonEl.className = 'btn';
      if (className) buttonEl.classList.add(className);
    }
  }

  render(): string {
    return button;
  }
}
