import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { getContext } from '@pages/Profile/scripts/context';
import type { IUser } from '@api/LoginApi';
import type { ProfilePageProps } from '@pages/Profile/scripts/types';

import styles from '../../styles/styles.module.scss';

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

export const defineMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }
  return mode;
};

const contextByMode = (user: IUser) => {
  const mode = defineMode();
  const defaultMode = mode || 'view';
  return { context: getContext(defaultMode === 'view', styles, user), mode: defaultMode };
};

export const getProps = (user: IUser): ProfilePageProps => {
  const {
    context: { inputs, buttons: btns },
    mode,
  } = contextByMode(user);

  const buttons = {
    editBtn: new Button(btns.editBtn),
    editPasswordBtn: new Button(btns.editPasswordBtn),
    exitBtn: new Button(btns.exitBtn),
    cancelBtn: new Button(btns.cancelBtn),
    saveBtn: new Button(btns.saveBtn),
  } satisfies ProfilePageProps['buttons'];

  return {
    avatar: new Img({ src: '', alt: 'Аватар', className: styles.avatar }),
    imgInput: new Input({
      label: new EditAvatarImg({ className: styles.editProfileTitle }),
      name: 'avatar',
      accept: 'image/jpeg',
      type: 'file',
    }),
    buttons,
    inputs: inputs.map((el) => new Input(el)),
    styles,
    isViewMode: mode === 'view',
    user,
  };
};
