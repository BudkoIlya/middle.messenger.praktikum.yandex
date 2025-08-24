import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { ChatItems } from '../../common/components/chatItems';
import { Img } from '../../../../components/img/scripts/img';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { checkValidationByFields } from '../../../../utils';

export class ActiveChatPage extends Block {
  constructor() {
    const input = new Input({
      name: 'message',
      placeholder: 'Сообщение',
      class: 'form__input chat__message',
    });

    const button = new Button({
      type: 'submit',
      className: 'form__send-message',
      name: 'message',
      text: new Img({ alt: 'Отправить', src: '/assets/arrow.svg', class: 'chat__add-file-btn' }),
    });

    super('div', {
      chatItems: new ChatItems(),
      img: new Img({ alt: 'Добавить', src: '/assets/add_btn.svg', class: 'chat__add-file-btn' }),
      input,
      button,
    });

    const div = this.getContent();
    if (div) {
      div.className = 'activeChat';
    }
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
