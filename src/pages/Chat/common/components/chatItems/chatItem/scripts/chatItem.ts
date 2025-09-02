import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';

import { default as chatItem } from '../chatItem.hbs';
import type { IChatItem } from '../types';

import styles from '../styles/chatItem.module.scss';

export class ChatItem extends Block {
  constructor(props: IChatItem) {
    super('', { styles, ...props }, [{ key: ElementsKeys.chatItem, template: chatItem }]);
  }

  render(): string {
    return chatItem;
  }
}
