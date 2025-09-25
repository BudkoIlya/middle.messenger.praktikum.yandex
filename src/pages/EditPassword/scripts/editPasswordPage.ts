import { Block } from '@common';
import { PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { ProfileController } from '@controllers';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { Props } from '@common/Block/types';
import type { IButton, IInput } from '@components';

import { EditPasswordComp } from '../templates';

import styles from '../styles/styles.module.scss';

interface IContext {
  inputs: IInput[];
  saveBtn: IButton;
  cancelBtn: IButton;
}

export interface EditPasswordPageProps extends Props {
  styles: CSSModuleClasses;
  inputs: Input[];
  saveBtn: Button;
  cancelBtn: Button;
}

const CONTEXT: IContext = {
  inputs: [
    { label: 'Старый пароль', name: 'oldPassword', type: 'password' },
    { label: 'Новый пароль', name: 'newPassword', type: 'password' },
    { label: 'Повторите пароль', name: 'confirmPassword', type: 'password' },
  ],
  saveBtn: { text: 'Сохранить', name: 'save_password', className: styles.saveBtn },
  cancelBtn: {
    text: 'Отменить',
    type: 'submit',
    className: styles.cancelBtn,
    path: PathConfig.settings.view,
    theme: null,
  },
};
export class EditPasswordPage extends Block<EditPasswordPageProps> {
  constructor() {
    const { inputs: inputsData, saveBtn, cancelBtn } = CONTEXT;

    const inputs = inputsData.map((el) => new Input(el));
    super('', {
      inputs,
      saveBtn: new Button(saveBtn),
      cancelBtn: new Button(cancelBtn),
      styles,
    });
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const { inputs, saveBtn, cancelBtn } = this.props;

    checkValidationByFields({
      root: element,
      inputs,
      button: saveBtn,
      onSubmit: async (v: { newPassword: string; oldPassword: string; confirmPassword: string }) => {
        if (v.newPassword !== v.confirmPassword) {
          window.alert('Пароли не совпадают');
          return;
        }
        await ProfileController.updatePassword({ newPassword: v.newPassword, oldPassword: v.oldPassword });
        window.alert('Пароль изменён');
      },
    });
    addRoutChangeListener({ element: cancelBtn });
  }

  render(): string {
    return EditPasswordComp;
  }
}
