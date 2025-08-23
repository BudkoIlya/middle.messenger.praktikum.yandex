import Handlebars from 'handlebars';

import { NotActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
// import { addRoutChangeListener } from '../../../../utils';
// import { Links } from '../../../../components/header/scripts/contants';
import { getContext } from '../../common';

export class NotActiveChatPage extends Block<{ id: string }> {
  constructor() {
    super('div', {
      props: { id: '1' },
      // events: [
      //   (element, remove) => addRoutChangeListener({ element, remove, selector: `a[data-id="${Links.profile}"]` }),
      // ],
    });

    const div = this.getContent();
    if (div) {
      div.className = 'notActiveChat';
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(NotActivePageComp);
    return mainTmp(getContext());
  }
}
