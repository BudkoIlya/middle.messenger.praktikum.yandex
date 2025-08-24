import { Block } from '../../../../../../../common/Block';
import type { IChatItem } from '../types';
import { default as chatItem } from '../chatItem.hbs';

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
