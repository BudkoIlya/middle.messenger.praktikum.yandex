import { Block } from '../../../common/Block';
import type { IInput } from '../types';

export class Input extends Block<IInput> {
  constructor(props: IInput) {
    super('label', { props });

    const label = this.getContent();
    if (label) label.className = 'label';
  }

  render() {
    return '';
  }
}
