import { Block } from '../../../common/Block';
import type { IInput } from '../types';
import input from '../input.hbs';

export class Input extends Block {
  constructor(props: IInput) {
    super('label', { props });

    const label = this.getContent();
    if (label) label.className = 'input';
  }

  render() {
    return input;
  }
}
