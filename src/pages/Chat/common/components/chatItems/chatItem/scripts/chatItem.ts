import { Block } from '@common/Block/Block';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { ChatController } from '@controllers/ChatController';
import { Button } from '@src/components/button';
import { Img } from '@src/components/img';
import type { Props } from '@common/Block/types';

import { default as chatItem } from '../chatItem.hbs';
import type { IChatItem } from '../types';

import styles from '../styles/chatItem.module.scss';
import stylesConfirm from '../styles/deleteBtn.module.scss';

interface IChatItemCrt extends Props {
  id: number;
  deleteConfirm: Button<ConfirmDelete>;
}

interface IConfirmDelete extends Props {
  deleteBtn?: Button;
  cancelBtn?: Button;
  show?: boolean;
  imgBtn?: Img;
  onClose?: () => void; // Сброс родительского флага
  chatId?: number;
}

export class ConfirmDelete extends Block<IConfirmDelete> {
  constructor(onClose?: () => void) {
    super('', {
      styles: stylesConfirm,
      deleteBtn: new Button({ text: 'Да' }),
      cancelBtn: new Button({ text: 'Нет', theme: null }),
      show: false,
      imgBtn: new Img({ src: '/assets/close.svg' }),
      onClose,
    });
  }

  render(): string {
    return `
        <div class="{{styles.wrapper}}">
          {{{imgBtn}}}
          <div class="{{styles.confirm}}{{#if show}} {{styles.show}}{{/if}}">
           <h3>Удалить?</h3>
           <div class="{{styles.buttons}}">
              {{{deleteBtn}}}
              {{{cancelBtn}}}
            </div>
          </div>
        </div>
      `;
  }

  afterRender() {
    const { cancelBtn, onClose, deleteBtn, chatId } = this.props;

    cancelBtn?.setProps({
      events: {
        click: (e) => {
          e.stopPropagation();
          this.setProps({ show: false });
          onClose?.();
        },
      },
    });

    deleteBtn?.setProps({
      events: {
        click: async (e) => {
          e.stopPropagation();
          if (chatId) {
            await ChatController.deleteChat(chatId);
            onClose?.();
          }
        },
      },
    });
  }
}

export class ChatItem extends Block<IChatItemCrt> {
  constructor(props: IChatItem) {
    super(
      '',
      {
        styles,
        ...props,
        deleteConfirm: new Button<ConfirmDelete>({
          text: new ConfirmDelete(() => this.setProps({ confirmOpen: false })),
          theme: null,
        }),
      },
      [{ key: ElementsKeys.chatItem, template: chatItem }],
    );
  }

  render(): string {
    return chatItem;
  }

  afterRender() {
    const { id, events, deleteConfirm } = this.props;

    deleteConfirm.setProps({
      events: {
        click: (e) => {
          e.stopPropagation();

          this.setProps({ confirmOpen: true });
          (deleteConfirm.props.text as ConfirmDelete).setProps({ show: true, chatId: id });
        },
      },
    });

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
