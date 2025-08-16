import Handlebars from 'handlebars';

import { LoginPageCom } from '../templates';
import { Block } from '../../../common/Block';
import type { IInput } from '../../../components';
import type { IButon } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
import { addRoutChangeListener } from '../../../utils';

interface IContext {
  inputs: IInput[];
  button: IButon;
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
    super('div');

    const div = this.getContent();
    if (div) {
      div.className = 'formLoginContainer';
      addRoutChangeListener({ element: div });
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(LoginPageCom);
    // TODO: здесь надо сделать обработчик на каждый input на onBlur для валидации и для кнопки
    return mainTmp(CONTEXT);
  }
}
