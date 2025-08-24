import { Block } from '../../../common/Block';
import { EditPasswordComp } from '../templates';
import { type IButton } from '../../../components/button';
import { type IInput, Input } from '../../../components/input';
import { Links, Paths } from '../../../components/header/scripts/contants';
import { Button } from '../../../components/button';
import { addRoutChangeListener, checkValidationByFields } from '../../../utils';

interface IContext {
  inputs: IInput[];
  saveBtn: IButton;
  cancelBtn: IButton;
}

const CONTEXT: IContext = {
  inputs: [
    { title: 'Старый пароль', name: 'old_password', type: 'password' },
    { title: 'Новый пароль', name: 'new_password', type: 'password' },
    { title: 'Повторите пароль', name: 'confirm_password', type: 'password' },
  ],
  saveBtn: { text: 'Сохранить', name: 'save_password', className: 'saveBtn' },
  cancelBtn: {
    text: 'Отменить',
    type: 'submit',
    className: 'cancelBtn',
    id: Links.profile,
    path: Paths.profile.view.path,
  },
};

export class EditPasswordPage extends Block {
  constructor() {
    const { inputs: inputsData, saveBtn, cancelBtn } = CONTEXT;

    const inputs = inputsData.map((el) => new Input(el));
    super('div', {
      inputs,
      saveBtn: new Button(saveBtn),
      cancelBtn: new Button(cancelBtn),
    });

    const div = this.getContent();
    if (div) {
      div.className = 'formProfilePasswordPage';
    }
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const inputs = this.props.inputs as Input[];
    const saveBtn = this.props.saveBtn as Button;
    const cancelBtn = this.props.cancelBtn as Button;
    checkValidationByFields(element, inputs, saveBtn);
    addRoutChangeListener({ element: cancelBtn });
  }

  render(): string {
    return EditPasswordComp;
  }
}
