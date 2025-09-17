import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import type { IButton, IInput } from '@components';
import type { IUser } from '@store/UserStore/types';

interface IContext {
  inputs: IInput[];
  isViewMode?: boolean;
  user?: IUser;
  buttons: {
    editBtn: IButton;
    editPasswordBtn: IButton;
    exitBtn: IButton;
    cancelBtn: IButton;
    saveBtn: IButton;
  };
}

export const getContext = (isViewMode: boolean, styles: CSSModuleClasses, user?: IUser): IContext => {
  const disabled = (isViewMode ? 'disabled' : '') as string;
  const { email, login, first_name, second_name, phone, display_name } = user || {};
  return {
    user,
    inputs: [
      { label: 'Почта', name: 'email', disabled, value: email },
      { label: 'Логин', name: 'login', disabled, value: login },
      { label: 'Имя', name: 'first_name', disabled, value: first_name },
      { label: 'Фамилия', name: 'second_name', disabled, value: second_name },
      { label: 'Телефон', name: 'phone', disabled, value: phone },
      { label: 'Отображаемое имя', name: 'display_name', disabled, value: display_name },
    ],
    isViewMode,
    buttons: {
      saveBtn: { text: 'Сохранить', name: 'save_profile' },
      editBtn: {
        text: 'Редактировать',
        name: 'edit_profile',
        className: styles.editProfileBtn,
        path: PathConfig[LinksPages.profile].edit,
      },
      editPasswordBtn: {
        text: 'Изменить пароль',
        name: 'edit_password',
        path: PathConfig[LinksPages.editPassword],
      },
      exitBtn: {
        text: 'Выйти',
        name: 'exit_profile',
        className: `${styles.exitBtn} ${styles.customBtn}`,
        theme: null,
      },
      cancelBtn: {
        text: 'Отменить',
        name: 'cancel',
        className: `${styles.cancelBtn} ${styles.customBtn}`,
        path: PathConfig[LinksPages.profile].view,
        theme: null,
      },
    },
  };
};
