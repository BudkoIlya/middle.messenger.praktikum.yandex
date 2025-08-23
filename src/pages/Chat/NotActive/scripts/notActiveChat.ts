import { NotActivePageComp } from '../templates';
import { Block } from '../../../../common/Block';
// import { addRoutChangeListener } from '../../../../utils';
// import { Links } from '../../../../components/header/scripts/contants';

export class NotActiveChatPage extends Block {
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
    return NotActivePageComp;
  }
}
