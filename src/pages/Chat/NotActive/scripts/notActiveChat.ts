import { NotActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { Input } from '../../../../components/input';
import { Button } from '../../../../components/button';
import { Img } from '../../../../components/img/scripts/img';
import { ChatItems } from '../../common/components/chatItems';

export class NotActiveChatPage extends Block {
  constructor() {
    super('div', {
      chatItems: new ChatItems(),
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
