import { RegisterPageComp } from '../templates';
import { Block } from '../../../common/Block';
import { Button, type IButton } from '../../../components/button';
import { type IInput, Input } from '../../../components/input';
import { Links, Paths } from '../../../components/header/scripts/contants';
import { addRoutChangeListener, checkValidationByFields } from '../../../utils';
import { Link } from '../../../components/link';

interface IContext {
  inputs: IInput[];
  button: IButton;
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
};

export class RegisterPage extends Block {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({ ...Paths[Links.login], className: 'registerLink', text: 'Вход' });

    super('div', { inputs, button: new Button(CONTEXT.button), link });

    const div = this.getContent();
    if (div) {
      div.className = 'formRegisterContainer';
    }
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
