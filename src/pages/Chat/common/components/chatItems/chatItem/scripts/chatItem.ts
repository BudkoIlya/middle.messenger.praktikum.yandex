import { Block } from '@common';

import { default as chatItem } from '../chatItem.hbs';
import type { IChatItem } from '../types';

import styles from '../styles/chatItem.module.scss';

export class ChatItem extends Block {
  constructor(props: IChatItem) {
    super('', { styles, ...props });
  }

  render(): string {
    return chatItem;
  }
}
