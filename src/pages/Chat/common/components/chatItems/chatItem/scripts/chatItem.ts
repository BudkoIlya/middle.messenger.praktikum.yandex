import { Block } from '@common';

import { default as chatItem } from '../chatItem.hbs';
import type { IChatItem } from '../types';

export class ChatItem extends Block {
  constructor({ class: className, ...rest }: IChatItem) {
    super('div', rest);

    const div = this.getContent();
    if (div) {
      div.className = 'chatItem';
    }
    if (className) {
      div?.classList.add(className);
    }
  }

  render(): string {
    return chatItem;
  }
}
