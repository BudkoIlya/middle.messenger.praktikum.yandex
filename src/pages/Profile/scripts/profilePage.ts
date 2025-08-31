import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { IButton } from '@components';

import { ProfileComp } from '../templates';
import { getContext } from './context';

import styles from '../styles/styles.module.scss';

const defineMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }

  return getContext(mode === 'view', styles);
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

export class ProfilePage extends Block {
  constructor() {
    const context = defineMode();

    const inputs = context.inputs.map((el) => new Input(el));
    const buttons = Object.fromEntries(
      Object.entries(context.buttons).map(([key, cfg]) => [key, new Button(cfg as IButton)]),
    );

    super('', {
      avatar: new Img({ src: '', alt: 'Аватар', className: styles.avatar }),
      imgInput: new Input({
        label: new EditAvatarImg({ className: styles.editProfileTitle }),
        name: 'avatar',
        accept: 'image/jpeg',
        type: 'file',
      }),
      inputs,
      buttons,
      isViewMode: context.isViewMode,
      styles,
    });
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const inputs = this.props.inputs as Input[];
    const saveBtn = (this.props.buttons as Record<string, unknown>).saveBtn as Button;
    const editBtn = (this.props.buttons as Record<string, unknown>).editBtn as Button;
    const editPasswordBtn = (this.props.buttons as Record<string, unknown>).editPasswordBtn as Button;
    const cancelBtn = (this.props.buttons as Record<string, unknown>).cancelBtn as Button;
    checkValidationByFields(element, inputs, saveBtn);
    addRoutChangeListener({ element: editBtn });
    addRoutChangeListener({ element: cancelBtn });
    addRoutChangeListener({ element: editPasswordBtn });
  }

  render(): string {
    return ProfileComp;
  }
}
