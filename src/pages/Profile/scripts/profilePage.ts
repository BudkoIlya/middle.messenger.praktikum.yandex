import Handlebars from 'handlebars';

import { Block } from '../../../common/Block';
import { ProfileComp } from '../templates';
import type { IInput } from '../../../components';
import { type IPageVariantsByLink, Links, Paths } from '../../../components/header/scripts/contants';
import { addRoutChangeListener } from '../../../utils';

interface IContext {
  inputs: IInput[];
  isViewMode?: boolean;
  buttons: {
    editBtn: {
      text: string;
      name: string;
      className: string;
      id: Links.profile;
      path: IPageVariantsByLink['profile']['edit']['path'];
    };
    editPasswordBtn: { text: string; name: string; className: string; path: string };
    cancelBtn: IPageVariantsByLink['profile']['view'];
  };
}

const getContext = (isViewMode: boolean): IContext => {
  const disabled = isViewMode ? 'disabled' : ('' as string);
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
    // TODO: нельзя помещать в button ссылку, надо стилизовать ссылку под кнопку, или повесить на кнопку функционал перехода
    buttons: {
      editBtn: {
        text: 'Редактировать',
        name: 'edit_profile',
        className: 'editProfileBtn',
        id: Links.profile,
        path: Paths['profile'].edit.path,
      },
      editPasswordBtn: {
        text: `<a class='link' href='${Links.profile}'>Изменить пароль</a>`, // TODO: поправить path как доделаю страницу редактирования
        name: 'edit_password',
        className: 'editProfileBtn',
        path: '', // TODO: доделать
      },
      cancelBtn: Paths[Links.profile].view, // TODO: поправить, переход пока не работает, надо переделать на ссылку в шаблоне, от кнопки избавиться
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
    super('div');

    const div = this.getContent();
    if (div) {
      div.className = 'formProfileContainer';
      // TODO: здесь надо сделать обработчик на каждый input на onBlur для валидации и для кнопки

      addRoutChangeListener({ element: div, selector: `button[data-id="${Links.profile}"]`, attribute: 'data-path' });
      addRoutChangeListener({ element: div, selector: `a[href^="${Links.profile}"]` });
    }
  }

  render(): string {
    const mainTmp = Handlebars.compile(ProfileComp);
    const context = this._defineMode();
    return mainTmp(context);
  }
}
