import { Block } from '@common';

import { ErrorComp } from '../template';

export class ErrorPage extends Block {
  constructor(props: { text: string }) {
    super('div', props);

    const div = this.getContent();
    if (div) div.className = 'errorPage';
  }

  protected render(): string {
    return ErrorComp;
  }
}
