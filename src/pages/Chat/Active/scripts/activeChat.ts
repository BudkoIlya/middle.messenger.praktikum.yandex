import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { ChatItems } from '../../common/components/chatItems';
import { Img } from '../../../../components/img/scripts/img';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { checkValidationByFields } from '../../../../utils';

export class ActiveChatPage extends Block {
  private _removeValidation?: () => void;

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
      id: '1',
      path: '2',
      chatItems: new ChatItems({ id: '1', path: '1' }),
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
    const remove = checkValidationByFields(element, [input], button);
    if (remove) this._removeValidation = remove;
  }

  unmount(): void {
    this._removeValidation?.();
    super.unmount();
  }

  render(): string {
    return ActivePageComp;
  }
}
