import { Block } from '@common/Block';

import button from '../button.hbs';
import type { IButton } from '../types';

import styles from '../styles/button.module.scss';

export class Button extends Block {
  constructor(props: IButton) {
    super('', { ...props, styles });
  }

  render(): string {
    return button;
  }
}
