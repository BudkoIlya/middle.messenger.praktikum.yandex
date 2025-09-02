import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { addRoutChangeListener, checkValidationByFields } from '@utils';

import { ProfileComp } from '../templates';
import { getContext } from './context';

import styles from '../styles/styles.module.scss';

const defineMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }

  return { context: getContext(mode === 'view', styles), mode: mode || 'view' };
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
    const { context } = defineMode();

    const buttons = Object.fromEntries(Object.entries(context.buttons).map(([key, props]) => [key, new Button(props)]));

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
    });
  }

  get propsByMode() {
    const { context, mode } = defineMode();
    const inputs = context.inputs.map((el) => new Input(el));
    return { ...this.props, isViewMode: mode === 'view', inputs };
  }

  forceUpdate() {
    super.forceUpdate(this.propsByMode);
  }

  dispatchComponentDidMount() {
    this.setProps(this.propsByMode);
    super.dispatchComponentDidMount();
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
