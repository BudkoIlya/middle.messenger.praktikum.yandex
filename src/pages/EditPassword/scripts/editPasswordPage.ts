import { Block } from '@common';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
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
  avatarImg: Img;
  imgInput: Input;
  styles: CSSModuleClasses;
  inputs: Input[];
  saveBtn: Button;
  cancelBtn: Button;
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
    path: PathConfig[LinksPages.profile].view,
    theme: null,
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

export class EditPasswordPage extends Block<EditPasswordPageProps> {
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

    const { inputs, saveBtn, cancelBtn } = this.props;

    checkValidationByFields({ root: element, inputs, button: saveBtn });
    addRoutChangeListener({ element: cancelBtn });
  }

  render(): string {
    return EditPasswordComp;
  }
}
