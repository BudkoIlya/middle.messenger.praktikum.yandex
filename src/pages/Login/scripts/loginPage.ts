import { Block } from '@common';
import { Button } from '@components/button';
import { Links, Paths } from '@components/header/scripts/contants';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
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

export class LoginPage extends Block {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({ ...Paths[Links.register], className: styles.registerButton, text: 'Регистрация' });

    super('', { inputs, button: new Button(CONTEXT.button), link, styles });
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const inputs = this.props.inputs as Input[];
    const button = this.props.button as Button;
    const link = this.props.link as Link;
    checkValidationByFields(element, inputs, button);
    addRoutChangeListener({ element: link });
  }

  render(): string {
    return LoginPageCom;
  }
}
