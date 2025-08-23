import { Block } from '../../../common/Block';
import type { IButton } from '../types';
import button from '../button.hbs';

export class Button extends Block {
  constructor(props: IButton) {
    super('label', { props });

    const label = this.getContent();
    if (label) {
      label.className = 'label';
      label.setAttribute('data-component', 'button');
    }
  }

  render(): string {
    return button;
  }
}
