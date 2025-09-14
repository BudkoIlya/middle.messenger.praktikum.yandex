import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { ChatController } from '@controllers/ChatController';
import type { Props } from '@common/Block/types';

import { default as chatItem } from '../chatItem.hbs';
import type { IChatItem } from '../types';

import styles from '../styles/chatItem.module.scss';

interface IChatItemCrt extends Props {
  id: number;
}

export class ChatItem extends Block<IChatItemCrt> {
  constructor(props: IChatItem) {
    super('', { styles, ...props }, [{ key: ElementsKeys.chatItem, template: chatItem }]);
  }

  render(): string {
    return chatItem;
  }

  afterRender() {
    const { id, events } = this.props;
    if (!events) {
      this.setProps({
        id,
        events: {
          click: async () => {
            await ChatController.connectToChat(id);
          },
        },
      });
    }
  }
}
