import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { Message } from '@components/message';
import { ChatController } from '@controllers/ChatController';
import { chatStore, connect, store } from '@store';
import { checkValidationByFields, formatDate } from '@utils';
import type { Props } from '@common/Block/types';
import type { ChatItemsCrt } from '@pages/Chat/common/components/chatItems/scripts';
import type { IStore } from '@store/types';

import { ChatItems } from '../../common/components/chatItems';
import { ActivePageComp } from '../templates';
import { AddUserImg } from './AddUserImg';

import styles from '../styles/styles.module.scss';

export interface ActiveChatPageProps extends Props {
  chatItems: ChatItemsCrt;
  messages?: Message[];
  img: Img;
  input: Input;
  button: Button;
  title?: string;
  addUserBtn?: AddUserImg;
}

export class ActiveChatPageCrt extends Block<ActiveChatPageProps> {
  constructor() {
    super(
      '',
      {
        chatItems: new ChatItems(),
        img: new Img({ alt: 'Добавить', src: '/assets/add_btn.svg', className: styles['chat__add-file-btn'] }),
        input: new Input({ name: 'message', placeholder: 'Сообщение', class: styles['form__input'] }),
        button: new Button<Img>({
          type: 'submit',
          className: styles['form__send-message'],
          name: 'message',
          text: new Img({ alt: 'Отправить', src: '/assets/arrow.svg', className: styles['chat__send-message'] }),
        }),
        styles,
      },
      [{ key: LinksPages.chat, template: ActivePageComp }],
    );
  }

  async dispatchComponentDidMount() {
    if (!store.state?.chat.chatList) await ChatController.getChats();

    const chatIdFromUrl = (() => {
      const parts = window.location.pathname.split('/');
      return Number(parts[parts.length - 1]);
    })();

    if (chatIdFromUrl !== null && !ChatController.isConnected) {
      await ChatController.connectToChat(chatIdFromUrl, false);
    }

    super.dispatchComponentDidMount();
  }

  render(): string {
    return ActivePageComp;
  }

  afterRender() {
    const root = this.getContent();
    if (!root) return;

    const { input, button } = this.props;

    checkValidationByFields({ root, inputs: [input], button, onSubmit: ChatController.onSubmit });
  }

  unmount() {
    chatStore.set('activeChat', undefined);
    ChatController.disconnectChat();
    super.unmount();
  }
}

const mapStateToProps = ({ chat, user }: IStore) => {
  const { activeChat, chatList } = chat || {};
  const { chatId, chatUsers, messages } = activeChat || {};
  return {
    messages: messages?.map(({ content, time, user_id, is_read }) => {
      const isOwner = Number(user_id) === user?.id;
      return new Message({
        text: content,
        time: formatDate(time),
        needStatus: isOwner ? true : is_read,
        class: isOwner ? styles['chat__answer_message'] : styles['chat__received_message'],
      });
    }),
    title: chatList?.find((el) => el.id === chatId)?.title,
    addUserBtn: new AddUserImg({ chatId, chatUsers }),
  };
};

export const ActiveChatPage = connect(ActiveChatPageCrt, mapStateToProps);
