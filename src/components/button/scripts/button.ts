import { Block } from '../../../common/Block';
import type { IButton } from '../types';
import button from '../button.hbs';

export class Button extends Block {
  constructor(props: IButton) {
    super('', props);
  }

  render(): string {
    return button;
  }
}
