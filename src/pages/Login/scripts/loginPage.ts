import { LoginPageCom } from '../templates';
import { Block } from '../../../common/Block';
import { type IButton } from '../../../components/button';
import { type IInput, Input } from '../../../components/input';
import { Links, Paths } from '../../../components/header/scripts/contants';
import { Link } from '../../../components/link';
import { Button } from '../../../components/button';
import { addRoutChangeListener, checkValidationByFields } from '../../../utils';

interface IContext {
  inputs: IInput[];
  button: IButton;
}

const CONTEXT: IContext = {
  inputs: [
    { title: 'Логин', name: 'login' },
    { title: 'Пароль', name: 'password', type: 'password' },
  ],
  button: { type: 'submit', name: 'sign_in', text: 'Войти', className: 'signInBtn' },
};

export class LoginPage extends Block {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({ ...Paths[Links.register], className: 'registerLink', text: 'Регистрация' });

    super('div', { inputs, button: new Button(CONTEXT.button), link });

    const div = this.getContent();
    if (div) {
      div.className = 'formLoginContainer';
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
    return LoginPageCom;
  }
}
