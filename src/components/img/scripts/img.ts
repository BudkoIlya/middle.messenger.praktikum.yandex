import { Block } from '@common/Block';

import { img } from '../template';
import type { IImg } from '../types';

export class Img extends Block {
  constructor({ alt, src, className }: IImg) {
    super('', { className });

    const imgEl = this.getContent();

    if (imgEl) {
      const attributes = { alt, src };

      Object.entries(attributes).forEach(([key, value]) => {
        if (!!value) {
          imgEl.setAttribute(key, value);
        }
      });
    }
  }

  render(): string {
    return img;
  }
}
