import { Block } from '@common/Block';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';

import { link } from '../template';
import type { ILink } from '../types';

export class Link extends Block {
  constructor(props: ILink) {
    super('', props, [{ key: ElementsKeys.link, template: link }]);
  }

  render(): string {
    return link;
  }
}
