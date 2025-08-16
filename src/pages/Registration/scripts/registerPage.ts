import Handlebars from 'handlebars';

import { RegisterPageComp } from '../templates';
import { Block } from '../../../common/Block';
import type { IInput } from '../../../components';
import type { IButon } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
import { addRoutChangeListener } from '../../../utils';

interface IContext {
  inputs: IInput[];
  button: IButon;
  link: IPageVariantsByLink['login'];
}

const CONTEXT: IContext = {
  inputs: [
    { title: 'Почта', name: 'email' },
    { title: 'Логин', name: 'login' },
    { title: 'Имя', name: 'first_name' },
    { title: 'Фамилия', name: 'second_name' },
    { title: 'Пароль', name: 'password', type: 'password' },
    { title: 'Подтверждение пароля', name: 'Пароль', type: 'password' },
  ],
  button: { type: 'submit', name: 'register', text: 'Зарегистрироваться', className: 'registerButton' },
  link: Paths[Links.login],
};

export class RegisterPage extends Block {
  constructor() {
    super('div');

    const div = this.getContent();
    if (div) {
      div.className = 'formRegisterContainer';
      // TODO: здесь надо сделать обработчик на каждый input на onBlur для валидации и для кнопки
      addRoutChangeListener({ element: div });
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(RegisterPageComp);
    return mainTmp(CONTEXT);
  }
}
