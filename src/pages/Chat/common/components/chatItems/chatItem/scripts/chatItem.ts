import { Block } from '../../../../../../../common/Block';
import type { IChatItem } from '../types';
import { default as chatItem } from '../chatItem.hbs';

export class ChatItem extends Block {
  constructor(props: IChatItem) {
    super('div', props);

    const div = this.getContent();
    if (div) {
      div.className = 'chatItem';
    }
  }

  render(): string {
    return chatItem;
  }
}
