import { Block } from '@common';
import { Button } from '@components/button';
import { Links, Paths } from '@components/header/scripts/contants';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { IButton, IInput } from '@components';

import { RegisterPageComp } from '../templates';

import styles from '../styles/styles.module.scss';

interface IContext {
  inputs: IInput[];
  button: IButton;
}

const CONTEXT: IContext = {
  inputs: [
    { label: 'Почта', name: 'email' },
    { label: 'Логин', name: 'login' },
    { label: 'Имя', name: 'first_name' },
    { label: 'Фамилия', name: 'second_name' },
    { label: 'Пароль', name: 'password', type: 'password' },
    { label: 'Подтверждение пароля', name: 'confirm_password', type: 'password' },
  ],
  button: { type: 'submit', name: 'register', text: 'Зарегистрироваться', className: styles.registerButton },
};

export class RegisterPage extends Block {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({ ...Paths[Links.login], className: styles.loginLink, text: 'Вход' });

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
    return RegisterPageComp;
  }
}
