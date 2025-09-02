import { Block } from '@common/Block';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';

import button from '../button.hbs';
import type { IButton } from '../types';

import styles from '../styles/button.module.scss';

export class Button extends Block {
  constructor(props: IButton) {
    const theme = props.theme === null ? null : (props.theme ?? 'default');
    super('', { ...props, theme, styles }, [{ key: ElementsKeys.button, template: button }]);
  }

  render(): string {
    return button;
  }
}
