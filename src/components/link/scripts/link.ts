import { Block } from '../../../common/Block';
import type { ILink } from '../types';
import { LinkComp } from '../template';

export class Link extends Block {
  constructor(props: ILink) {
    super('', props);
  }

  render(): string {
    return LinkComp;
  }
}
