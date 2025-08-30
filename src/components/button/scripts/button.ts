import { Block } from '@common/Block';

import button from '../button.hbs';
import type { IButton } from '../types';

export class Button extends Block {
  constructor(props: IButton) {
    super('', props);
  }

  render(): string {
    return button;
  }
}
