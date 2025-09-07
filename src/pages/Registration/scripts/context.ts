import type { IButton, IInput } from '@components';

import { registerButton } from '../styles/styles.module.scss';

interface IContext {
  inputs: IInput[];
  button: IButton;
}

export const CONTEXT: IContext = {
  inputs: [
    { label: 'Почта', name: 'email' },
    { label: 'Логин', name: 'login' },
    { label: 'Имя', name: 'first_name' },
    { label: 'Фамилия', name: 'second_name' },
    { label: 'Пароль', name: 'password', type: 'password' },
    { label: 'Подтверждение пароля', name: 'confirm_password', type: 'password' },
  ],
  button: { type: 'submit', name: 'register', text: 'Зарегистрироваться', className: registerButton },
};
