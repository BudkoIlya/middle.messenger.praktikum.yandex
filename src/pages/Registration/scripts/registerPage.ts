import Handlebars from 'handlebars';

import { RegisterPageComp } from '../templates';
import { Block } from '../../../common/Block';
import type { IButton, IInput } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
// import { addRoutChangeListener, checkValidationByFields } from '../../../utils';

interface IContext {
  inputs: IInput[];
  button: IButton;
  link: IPageVariantsByLink['login'];
}

const CONTEXT: IContext = {
  inputs: [
    { title: 'Почта', name: 'email' },
    { title: 'Логин', name: 'login' },
    { title: 'Имя', name: 'first_name' },
    { title: 'Фамилия', name: 'second_name' },
    { title: 'Пароль', name: 'password', type: 'password' },
    { title: 'Подтверждение пароля', name: 'confirm_password', type: 'password' },
  ],
  button: { type: 'submit', name: 'register', text: 'Зарегистрироваться', className: 'registerButton' },
  link: Paths[Links.login],
};

export class RegisterPage extends Block {
  constructor() {
    super('div', { props: { id: '1' } });

    // this.componentDidUpdate = (oldProps, newProps) => oldProps.class !== newProps.class;

    const div = this.getContent();
    if (div) {
      div.className = 'formRegisterContainer';
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(RegisterPageComp);
    return mainTmp(CONTEXT);
  }
}
