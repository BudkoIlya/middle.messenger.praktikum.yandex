import { Block } from '../../../../../../../common/Block';
import type { IChatItem } from '../types';

export class ChatItem extends Block<IChatItem> {
  constructor(props: IChatItem) {
    super('label', { props });

    const label = this.getContent();
    if (label) {
      label.className = 'label';
    }
  }

  render(): string {
    // const mainTmp = Handlebars.compile(RegisterPageComp);
    // return mainTmp(CONTEXT);
    return '';
  }
}
