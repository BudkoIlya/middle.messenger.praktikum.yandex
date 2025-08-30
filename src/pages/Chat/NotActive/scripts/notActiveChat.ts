import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';

import { ChatItems } from '../../common/components/chatItems';
import { NotActivePageComp } from '../templates';

export class NotActiveChatPage extends Block {
  constructor() {
    super('div', {
      chatItems: new ChatItems({ active: false }),
      img: new Img({ alt: 'Добавить', src: '/assets/add_btn.svg', class: 'chat__add-file-btn' }),
      input: new Input({ name: 'message', placeholder: 'Сообщение' }),
      button: new Button({
        type: 'submit',
        className: 'form__send-message',
        name: 'message',
        text: new Img({ alt: 'Отправить', src: '/assets/arrow.svg', class: 'chat__add-file-btn' }),
      }),
    });

    const div = this.getContent();
    if (div) {
      div.className = 'notActiveChat';
    }
  }

  render(): string {
    return NotActivePageComp;
  }
}
