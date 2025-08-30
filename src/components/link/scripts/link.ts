import { Block } from '@common/Block';

import { LinkComp } from '../template';
import type { ILink } from '../types';

export class Link extends Block {
  constructor(props: ILink) {
    super('', props);
  }

  render(): string {
    return LinkComp;
  }
}
