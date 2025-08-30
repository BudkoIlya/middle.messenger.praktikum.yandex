import { Block } from '@common/Block';

import input from '../input.hbs';
import type { IInput } from '../types';

export class Input extends Block {
  constructor(props: IInput) {
    super('', { ...props });
  }

  render() {
    return input;
  }
}
