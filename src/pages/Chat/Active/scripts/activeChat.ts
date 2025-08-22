import Handlebars from 'handlebars';

import { ActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
import { addRoutChangeListener } from '../../../../utils';
import { Links } from '../../../../components/header/scripts/contants';
import { getContext } from '../../common';

export class ActiveChatPage extends Block {
  constructor() {
    super('div', {
      events: [
        ({ element, remove }) => addRoutChangeListener({ element, remove, selector: `a[data-id="${Links.profile}"]` }),
      ],
    });

    const div = this.getContent();
    if (div) {
      div.className = 'activeChat';
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(ActivePageComp);
    return mainTmp(getContext(true));
  }
}
