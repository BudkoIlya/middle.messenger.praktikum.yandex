import { Block } from '../../../common/Block';
import type { IImg } from '../types';
import { img } from '../template';

export class Img extends Block {
  constructor({ class: className, alt, src }: IImg) {
    super('', {});

    const imgEl = this.getContent();

    if (imgEl) {
      const attributes = { alt, src };

      Object.entries(attributes).forEach(([key, value]) => {
        if (!!value) {
          imgEl.setAttribute(key, value);
        }
      });

      imgEl.className = 'img';
      if (className) imgEl.classList.add(className);
    }
  }

  render(): string {
    return img;
  }
}
