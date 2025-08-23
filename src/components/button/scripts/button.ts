import { Block } from '../../../common/Block';
import type { IButton } from '../types';

export class Button extends Block<IButton> {
  constructor(props: IButton) {
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
