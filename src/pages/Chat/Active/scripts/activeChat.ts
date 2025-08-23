import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { ChatItems } from '../../common/templates/chatItems';

export class ActiveChatPage extends Block {
  constructor() {
    super('div', {
      id: '1',
      path: '2',
      chatItems: new ChatItems({ id: '1', path: '1' }),
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
