import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
// import { addRoutChangeListener } from '../../../../utils';
// import { Links } from '../../../../components/header/scripts/contants';
// import { getContext } from '../../common/scripts';
// import type { IContext } from '../../common/scripts/constants';
// import { ChatItems } from '../../common/templates/chatItems';

export class ActiveChatPage extends Block {
  constructor() {
    // const context = getContext(true);
    super('div', {
      // props: getContext(true),
      // id: '1',
      // path: '2',
      // chatItems: new ChatItems(context),
      // children: [
      //   { item: new ChatItems(context) },
      // ],
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
