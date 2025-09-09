import { Block } from '@common';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { LoginController } from '@controllers';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { Props } from '@common/Block/types';
import type { IButton, IInput } from '@components';

import { LoginPageCom } from '../templates';

import styles from '../styles/styles.module.scss';

interface IContext {
  inputs: IInput[];
  button: IButton;
}

const CONTEXT: IContext = {
  inputs: [
    { label: 'Логин', name: 'login' },
    { label: 'Пароль', name: 'password', type: 'password' },
  ],
  button: { type: 'submit', name: 'sign_in', text: 'Войти', className: styles.signInBtn },
};

export interface LoginPageProps extends Props {
  styles: CSSModuleClasses;
  inputs: Input[];
  link: Link;
  button: Button;
}

export class LoginPage extends Block<LoginPageProps> {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({
      path: PathConfig[LinksPages.register],
      className: styles.registerButton,
      text: 'Регистрация',
    });

    super('', { inputs, button: new Button(CONTEXT.button), link, styles });
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const inputs = this.props.inputs;
    const button = this.props.button;
    const link = this.props.link;
    checkValidationByFields({ root: element, inputs, button, controller: new LoginController() });
    addRoutChangeListener({ element: link });
  }

  render(): string {
    return LoginPageCom;
  }
}
