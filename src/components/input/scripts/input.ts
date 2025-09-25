import { Block } from '@common/Block';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';

import input from '../input.hbs';
import type { IInput } from '../types';

import styles from '../styles/input.module.scss';

export class Input extends Block {
  constructor(props: IInput) {
    super('', { ...props, styles }, [{ key: ElementsKeys.input, template: input }]);
  }

  render() {
    return input;
  }
}
