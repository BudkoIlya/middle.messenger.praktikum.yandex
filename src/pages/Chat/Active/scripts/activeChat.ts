import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { ChatItems } from '../../common/components/chatItems';
import { Img } from '../../../../components/img/scripts/img';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components';

export class ActiveChatPage extends Block {
  constructor() {
    super('div', {
      id: '1',
      path: '2',
      chatItems: new ChatItems({ id: '1', path: '1' }),
      img: new Img({ alt: 'Добавить', src: '/assets/add_btn.svg', class: 'chat__add-file-btn' }),
      input: new Input({ name: 'message', placeholder: 'Сообщение', class: 'form__input chat__message' }),
      button: new Button({
        type: 'submit',
        className: 'form__send-message',
        name: 'message',
        text: new Img({ alt: 'Отправить', src: '/assets/arrow.svg', class: 'chat__add-file-btn' }),
      }),
      // events: [
      //   ({ element, remove }) => addRoutChangeListener({ element, remove, selector: `a[data-id="${Links.profile}"]` }),
      // ],
    });

    const div = this.getContent();
    if (div) {
      div.className = 'activeChat';
    }
  }

  render(): string {
    return ActivePageComp;
  }
}
