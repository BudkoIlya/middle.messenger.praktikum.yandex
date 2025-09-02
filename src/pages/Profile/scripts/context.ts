import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import type { IButton, IInput } from '@components';

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

export const getContext = (isViewMode: boolean, styles: CSSModuleClasses): IContext => {
  const disabled = (isViewMode ? 'disabled' : '') as string;
  return {
    inputs: [
      { label: 'Почта', name: 'email', disabled, value: 'example@yandex.ru' },
      { label: 'Логин', name: 'login', disabled, value: 'Login' },
      { label: 'Имя', name: 'first_name', disabled, value: 'Имя' },
      { label: 'Фамилия', name: 'second_name', disabled, value: 'Фамилия' },
      { label: 'Телефон', name: 'phone', disabled, value: '89201009090' },
      { label: 'Отображаемое имя', name: 'display_name', disabled, value: 'Display_Name' },
    ],
    isViewMode,
    buttons: {
      saveBtn: {
        text: 'Сохранить',
        name: 'save_profile',
        className: styles.saveProfileBtn,
      },
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
      deleteBtn: {
        text: 'Удалить',
        name: 'delete_profile',
        className: `${styles.deleteBtn} ${styles.customBtn}`,
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
