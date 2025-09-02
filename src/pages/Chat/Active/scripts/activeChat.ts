import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { Message } from '@components/message';
import { checkValidationByFields } from '@utils';

import { ChatItems } from '../../common/components/chatItems';
import { ActivePageComp } from '../templates';

import styles from '../styles/styles.module.scss';

export class ActiveChatPage extends Block {
  constructor() {
    super(
      '',
      {
        chatItems: new ChatItems({ active: true }),
        messages: [
          new Message({ text: 'Привет', time: '12:00', class: styles['chat__received_message'] }),
          new Message({ text: 'Привет', time: '12:01', needStatus: true, class: styles['chat__answer_message'] }),
        ],
        img: new Img({ alt: 'Добавить', src: '/assets/add_btn.svg', className: styles['chat__add-file-btn'] }),
        input: new Input({ name: 'message', placeholder: 'Сообщение', class: styles['form__input'] }),
        button: new Button({
          type: 'submit',
          className: styles['form__send-message'],
          name: 'message',
          text: new Img({
            alt: 'Отправить',
            src: '/assets/arrow.svg',
            className: styles['chat__send-message'],
          }),
        }),
        styles,
      },
      [{ key: LinksPages.chat, template: ActivePageComp }],
    );
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const input = this.props.input as Input;
    const button = this.props.button as Button;
    checkValidationByFields(element, [input], button);
  }

  render(): string {
    return ActivePageComp;
  }
}
