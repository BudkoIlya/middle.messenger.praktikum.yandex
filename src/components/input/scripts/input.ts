import { Block } from '../../../common/Block';
import type { IInput } from '../types';
import input from '../input.hbs';

export class Input extends Block {
  constructor(props: IInput) {
    super('', props);
  }

  render() {
    return input;
  }
}
