import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { ProfilePageProps } from '@pages/Profile/scripts/types';

import { ProfileComp } from '../templates';
import { getContext } from './context';

import styles from '../styles/styles.module.scss';

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

const defineMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }

  return { context: getContext(mode === 'view', styles), mode: mode || 'view' };
};

export class ProfilePage extends Block<ProfilePageProps> {
  constructor() {
    const { context, mode } = defineMode();

    const buttons = {
      editBtn: new Button(context.buttons.editBtn),
      editPasswordBtn: new Button(context.buttons.editPasswordBtn),
      deleteBtn: new Button(context.buttons.deleteBtn),
      cancelBtn: new Button(context.buttons.cancelBtn),
      saveBtn: new Button(context.buttons.saveBtn),
    } satisfies ProfilePageProps['buttons'];

    const inputs = context.inputs.map((el) => new Input(el));

    super('', {
      avatar: new Img({ src: '', alt: 'Аватар', className: styles.avatar }),
      imgInput: new Input({
        label: new EditAvatarImg({ className: styles.editProfileTitle }),
        name: 'avatar',
        accept: 'image/jpeg',
        type: 'file',
      }),
      buttons,
      styles,
      isViewMode: mode === 'view',
      inputs,
    });
  }

  private get _propsByMode() {
    const { context, mode } = defineMode();
    const inputs = context.inputs.map((el) => new Input(el));
    return { ...this.props, isViewMode: mode === 'view', inputs };
  }

  forceUpdate = () => {
    super.forceUpdate(this._propsByMode);
  };

  dispatchComponentDidMount() {
    this.setProps(this._propsByMode);
    super.dispatchComponentDidMount();
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const { inputs, buttons } = this.props;
    const { saveBtn, editBtn, editPasswordBtn, cancelBtn } = buttons;

    checkValidationByFields({ root: element, inputs: inputs, button: saveBtn });
    addRoutChangeListener({ element: editBtn });
    addRoutChangeListener({ element: cancelBtn });
    addRoutChangeListener({ element: editPasswordBtn });
  }

  render(): string {
    return ProfileComp;
  }
}
