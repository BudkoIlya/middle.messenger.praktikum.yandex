import { Block } from '@common';
import { Button } from '@components/button';
import { Links, Paths } from '@components/header/scripts/contants';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { IButton, IInput } from '@components';

import { EditPasswordComp } from '../templates';

import styles from '../styles/styles.module.scss';

interface IContext {
  inputs: IInput[];
  saveBtn: IButton;
  cancelBtn: IButton;
}

const CONTEXT: IContext = {
  inputs: [
    { label: 'Старый пароль', name: 'old_password', type: 'password' },
    { label: 'Новый пароль', name: 'new_password', type: 'password' },
    { label: 'Повторите пароль', name: 'confirm_password', type: 'password' },
  ],
  saveBtn: { text: 'Сохранить', name: 'save_password', className: styles.saveBtn },
  cancelBtn: {
    text: 'Отменить',
    type: 'submit',
    className: styles.cancelBtn,
    id: Links.profile,
    path: Paths.profile.view.path,
  },
};

class EditAvatarImg extends Block {
  constructor({ className }: { className?: string }) {
    super('', {
      img: new Img({ alt: 'Редактировать', src: '/assets/edit.svg', className: styles.editAvatarImg }),
      className,
    });
  }

  render() {
    return `
      <span class="{{className}}">
        {{{img}}}
        <span>Изменить</span>
      </span>
    `;
  }
}

export class EditPasswordPage extends Block {
  constructor() {
    const { inputs: inputsData, saveBtn, cancelBtn } = CONTEXT;

    const inputs = inputsData.map((el) => new Input(el));
    super('', {
      avatarImg: new Img({ src: '', alt: 'Аватар', className: styles.avatar }),
      imgInput: new Input({
        label: new EditAvatarImg({ className: styles.editProfileTitle }),
        name: 'avatar',
        accept: 'image/jpeg',
        type: 'file',
      }),
      inputs,
      saveBtn: new Button(saveBtn),
      cancelBtn: new Button(cancelBtn),
      styles,
    });
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
