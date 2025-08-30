import { Block } from '@common';
import { Button } from '@components/button';
import { Links, Paths } from '@components/header/scripts/contants';
import { Input } from '@components/input';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { IButton, IInput } from '@components';

import { ProfileComp } from '../templates';

interface IContext {
  inputs: IInput[];
  isViewMode?: boolean;
  buttons: {
    editBtn: IButton;
    editPasswordBtn: IButton;
    deleteBtn: IButton;
    cancelBtn: IButton;
    saveBtn: IButton;
  };
}

const getContext = (isViewMode: boolean): IContext => {
  const disabled = (isViewMode ? 'disabled' : '') as string;
  return {
    inputs: [
      { title: 'Почта', name: 'email', disabled, value: 'example@yandex.ru' },
      { title: 'Логин', name: 'login', disabled, value: 'Login' },
      { title: 'Имя', name: 'first_name', disabled, value: 'Имя' },
      { title: 'Фамилия', name: 'second_name', disabled, value: 'Фамилия' },
      { title: 'Телефон', name: 'phone', disabled, value: '89201009090' },
      { title: 'Отображаемое имя', name: 'display_name', disabled, value: 'Display_Name' },
    ],
    isViewMode,
    buttons: {
      saveBtn: {
        text: 'Сохранить',
        name: 'save_profile',
        className: 'saveProfileBtn',
      },
      editBtn: {
        text: 'Редактировать',
        name: 'edit_profile',
        className: 'editProfileBtn',
        id: Links.profile,
        path: Paths.profile.edit.path,
      },
      editPasswordBtn: {
        text: 'Изменить пароль',
        name: 'edit_password',
        id: Links.editPassword,
        path: Paths.editPassword.path,
      },
      deleteBtn: {
        text: 'Удалить',
        name: 'delete_profile',
        className: 'deleteBtn customBtn',
      },
      cancelBtn: {
        text: 'Отменить',
        name: 'cancel',
        className: 'cancelBtn customBtn',
        id: Links.profile,
        path: Paths.profile.view.path,
      },
    },
  };
};

const defineMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if (mode) {
    document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
  }

  return getContext(mode === 'view');
};

export class ProfilePage extends Block {
  constructor() {
    const context = defineMode();

    const inputs = context.inputs.map((el) => new Input(el));
    const buttons = Object.fromEntries(
      Object.entries(context.buttons).map(([key, cfg]) => [key, new Button(cfg as IButton)]),
    );

    super('div', { inputs, buttons, isViewMode: context.isViewMode });

    const div = this.getContent();
    if (div) {
      div.className = 'formProfileContainer';
    }
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
