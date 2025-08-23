import Handlebars from 'handlebars';

import { Block } from '../../../common/Block';
import { ProfileComp } from '../templates';
import type { IButton, IInput } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
// import { addRoutChangeListener } from '../../../utils';

interface IContext {
  inputs: IInput[];
  isViewMode?: boolean;
  buttons: {
    editBtn: IButton;
    editPasswordBtn: IButton;
    cancelBtn: IPageVariantsByLink['profile']['view'];
  };
}

const getContext = (isViewMode: boolean): IContext => {
  const disabled = (isViewMode ? 'disabled' : '') as string;
  return {
    inputs: [
      { title: 'Почта', name: 'email', disabled, value: 'example@yandex.ru' },
      { title: 'Логин', name: 'login', disabled, value: 'Логин' },
      { title: 'Имя', name: 'name', disabled, value: 'Имя' },
      { title: 'Фамилия', name: 'second_name', disabled, value: 'Фамилия' },
      { title: 'Телефон', name: 'phone', disabled, value: 'Телефон' },
      { title: 'Отображаемое имя', name: 'display_name', disabled, value: 'Отображаемое имя' },
    ],
    isViewMode,
    buttons: {
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
        className: 'editProfileBtn',
        id: Links.editPassword,
        path: Paths.editPassword.path,
      },
      cancelBtn: Paths.profile.view,
    },
  };
};

export class ProfilePage extends Block {
  private _isViewMode = false;

  private _defineMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode) {
      document.title = mode === 'view' ? 'Профиль' : 'Редактирование профиля';
    }

    this._isViewMode = mode === 'view';

    return getContext(this._isViewMode);
  }

  constructor() {
    super('div', {
      // props: { id: 'id' },
      // events: [
      //   ({ element, remove }) =>
      //     addRoutChangeListener({
      //       element,
      //       remove,
      //       selector: `button[data-id="${Links.profile}"]`,
      //       attribute: 'data-path',
      //     }),
      //   ({ element, remove }) => addRoutChangeListener({ element, remove, selector: `a[href^="${Links.profile}"]` }),
      //   ({ element, remove }) =>
      //     addRoutChangeListener({
      //       element,
      //       remove,
      //       selector: `button[data-id="${Links.editPassword}"]`,
      //       attribute: 'data-path',
      //     }),
      // ],
    });

    const div = this.getContent();
    if (div) {
      div.className = 'formProfileContainer';
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(ProfileComp);
    const context = this._defineMode();
    return mainTmp(context);
  }
}
