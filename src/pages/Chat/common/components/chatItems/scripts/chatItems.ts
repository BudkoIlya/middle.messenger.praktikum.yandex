import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { ChatController } from '@controllers/ChatController';
import { connect } from '@store';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import { COMMON_REG_EXP } from '@utils/constants';
import type { Props } from '@common/Block/types';
import type { Link } from '@components/link';

import { getContext } from '../../../scripts';
import chatItemsTemplate from '../chatItems.hbs';
import type { ChatItem } from '../chatItem';

import styles from '../styles/chatItems.module.scss';

export class ButtonText extends Block {
  constructor() {
    super('span', {});
  }

  render() {
    return 'Добавить';
  }
}
interface IChatItems extends Props {
  chatItems?: ChatItem[];
  link?: Link;
  input: Input;
  button: Button;
  chatNameInput: ChatNameInput;
}

interface IChatNameInput extends Props {
  input: Input;
  className?: string;
  showClassName?: string;
  applyBtn: Button;
  cancelBtn: Button;
}

class ChatNameInput extends Block<IChatNameInput> {
  constructor() {
    super('', {
      input: new Input({
        name: 'title',
        placeholder: 'Название чата',
        class: styles.chatTitleInput,
        helperTextClass: styles.helperText,
      }),
      className: styles.chatTitleInputWrapper,
      applyBtn: new Button({ name: 'Create', text: 'Создать', type: 'submit', theme: null }),
      cancelBtn: new Button({ name: 'cancel', text: 'Отменить', theme: null }),
      createChatButtons: styles.createChatButtons,
    });
  }

  render(): string {
    return `<form class="{{className}} {{showClassName}}">
        {{{input}}}
      <div class="{{createChatButtons}}">{{{applyBtn}}}{{{cancelBtn}}}</div>
    </form>`;
  }

  afterRender() {
    const element = this.getContent();
    if (!element) return;

    const { applyBtn, cancelBtn, input } = this.props;

    const closeCreateChat = () => {
      input.setProps({ ...this.props.input.props, value: '', error: false });
      this.setProps({ ...this.props, showClassName: '' });
    };

    checkValidationByFields<{ title: string }>({
      root: element,
      inputs: [input],
      button: applyBtn,
      customValidate: (_name, value) => COMMON_REG_EXP.textWithNumber.test(value),
      async onSubmit(values) {
        try {
          await ChatController.createChat(values.title);
          closeCreateChat();
        } catch (e) {}
      },
    });

    cancelBtn.setProps({
      events: {
        click: () => {
          closeCreateChat();
        },
      },
    });
  }
}

export class ChatItemsCrt extends Block<IChatItems> {
  constructor() {
    super(
      '',
      {
        input: new Input({
          name: 'search',
          placeholder: 'Поиск',
          class: styles['chat__search'],
        }),
        chatNameInput: new ChatNameInput(),
        button: new Button({
          name: 'add',
          text: [new Img({ src: '/assets/add_btn.svg', alt: 'Добавить' }), new ButtonText()],
          className: styles['add_btn'],
          theme: null,
        }),
        styles,
      },
      [{ key: ElementsKeys.chatItems, template: chatItemsTemplate }],
    );
  }

  render(): string {
    return chatItemsTemplate;
  }

  afterRender() {
    const element = this.getContent();
    if (!element) return;

    const { link, button, chatNameInput } = this.props;

    const { props: chatTitleProps, setProps: chatTitlePropsSetProps } = chatNameInput;

    button.setProps({
      events: {
        click: () => {
          chatTitlePropsSetProps({ ...chatTitleProps, showClassName: styles.show });
        },
      },
    });

    addRoutChangeListener({ element: link });
  }
}

export const ChatItems = connect(ChatItemsCrt, ({ chat, user }) => getContext({ chat, user }));
