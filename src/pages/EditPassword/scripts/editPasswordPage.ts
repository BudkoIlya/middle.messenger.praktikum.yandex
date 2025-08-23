import { Block } from '../../../common/Block';
// import type { IButton, IInput } from '../../../components';
// import { Links, Paths } from '../../../components/header/scripts/contants';
// import { addRoutChangeListener } from '../../../utils';
import { EditPasswordComp } from '../templates';

// interface IContext {
//   inputs: IInput[];
//   editBtn: IButton;
// }

// const CONTEXT: IContext = {
//   inputs: [
//     { title: 'Старый пароль', name: 'old_password', type: 'password' },
//     { title: 'Новый пароль', name: 'new_password', type: 'password' },
//     { title: 'Повторите пароль', name: 'confirm_password', type: 'password' },
//   ],
//   editBtn: { text: 'Отменить', id: Links.profile, path: Paths['profile'].view.path },
// };

export class EditPasswordPage extends Block {
  constructor() {
    super('div', {
      props: { id: 'id' },
      // events: [
      //   ({ element, remove }) =>
      //     addRoutChangeListener({
      //       element,
      //       remove,
      //       selector: `button[data-id="${Links.profile}"]`,
      //       attribute: 'data-path',
      //     }),
      // ],
    });

    const div = this.getContent();
    if (div) {
      div.className = 'formProfilePasswordPage';
    }
  }

  render(): string {
    return EditPasswordComp;
  }
}
