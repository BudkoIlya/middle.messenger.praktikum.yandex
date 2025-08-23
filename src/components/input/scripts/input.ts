import { Block } from '../../../common/Block';
import type { IInput } from '../types';
import input from '../input.hbs';

export class Input extends Block {
  constructor({ class: className, ...props }: IInput) {
    super('label', props);

    const label = this.getContent();
    if (label) {
      label.classList.add('label');
      if (className) {
        label.querySelector('input')?.classList.add(className);
      }
    }
  }

  render() {
    return input;
  }
}
