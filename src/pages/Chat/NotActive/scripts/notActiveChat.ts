import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';

import { ChatItems } from '../../common/components/chatItems';
import { NotActivePageComp } from '../templates';

import styles from '../styles/styles.module.scss';

export class NotActiveChatPage extends Block {
  constructor() {
    super(
      '',
      {
        chatItems: new ChatItems({ active: false }),
        styles,
      },
      [{ key: LinksPages.chat, template: NotActivePageComp }],
    );
  }

  render(): string {
    return NotActivePageComp;
  }
}
