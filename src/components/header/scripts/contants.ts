import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import {
  ActiveChatPage,
  EditPasswordPage,
  ErrorPage,
  HomePage,
  LoginPage,
  NotActiveChatPage,
  ProfilePage,
  RegisterPage,
} from '@pages';

import type { INavigation } from '../template';
import type { IPageVariantsByLink } from './types';

import styles from '../styles/navigation.module.scss';

const { homepage, register, login, profile, editPassword, chat, error } = LinksPages;

export const Routers: IPageVariantsByLink = {
  [homepage]: { path: PathConfig[homepage], component: HomePage },
  [register]: { path: PathConfig[register], component: RegisterPage },
  [login]: { path: PathConfig[login], component: LoginPage },
  [profile]: [
    { path: PathConfig[profile].view, component: ProfilePage },
    { path: PathConfig[profile].edit, component: ProfilePage },
  ],
  [editPassword]: { path: PathConfig[editPassword], component: EditPasswordPage },
  [chat]: [
    { path: PathConfig[chat].notActive, component: NotActiveChatPage },
    { path: PathConfig[chat].active, component: ActiveChatPage },
  ],
  [error]: { path: PathConfig[error], component: ErrorPage },
};

export const NAVIGATION_CONTEXT: { links: INavigation[]; styles: CSSModuleClasses } = {
  links: [
    { path: PathConfig[homepage], text: 'Главная' },
    { path: PathConfig[register], text: 'Регистрация' },
    { path: PathConfig[login], text: 'Вход' },
    { path: PathConfig[profile].view, text: 'Профиль' },
    { path: PathConfig[editPassword], text: 'Изменить пароль' },
    { path: PathConfig[chat].notActive, text: 'Чат' },
    // { path: PathConfig[error], text: 'Ошибка', hidden: 'hidden' },
  ],
  styles,
};
