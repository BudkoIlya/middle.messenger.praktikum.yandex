import { LoginPageCom } from '../templates';
import { Block } from '../../../common/Block';
import type { IInput } from '../../../components';
import type { IButton } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
// import { addRoutChangeListener } from '../../../utils';

interface IContext {
  inputs: IInput[];
  button: IButton;
  link: IPageVariantsByLink['register'];
}

const CONTEXT: IContext = {
  inputs: [
    { title: 'Логин', name: 'login' },
    { title: 'Пароль', name: 'password', type: 'password' },
  ],
  button: { type: 'submit', name: 'sign_in', text: 'Войти', className: 'signInBtn' },
  link: Paths[Links.register],
};

export class LoginPage extends Block {
  constructor() {
    super('div', {
      // events: [({ element, remove }) => addRoutChangeListener({ element, remove })]
    });

    const div = this.getContent();
    if (div) {
      div.className = 'formLoginContainer';
    }
  }

  render(): string {
    return LoginPageCom;
  }
}
