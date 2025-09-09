import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import {
  ActiveChatPage,
  EditPasswordPage,
  ErrorPage,
  LoginPage,
  NotActiveChatPage,
  ProfilePage,
  RegisterPage,
} from '@pages';
import type { IUser } from '@api/LoginApi';
import type { BlockConstructor } from '@common/Router/Router';

import type { IPageVariantsByLink, NavigationProps } from './types';

import styles from '../styles/navigation.module.scss';

const { register, login, profile, editPassword, chat, error } = LinksPages;

// export const named = (exportName: string) => (m: Record<string, unknown>) => ({
//   default: m[exportName] as BlockConstructor,
// });

// export const Routers: IPageVariantsByLink = {
//   [register]: {
//     path: PathConfig[register],
//     component: () => import('@pages/Registration/scripts/registerPage').then(named('RegisterPage')),
//   },
//   [login]: {
//     path: PathConfig[login],
//     component: () => import('@pages/Login/scripts/loginPage').then(named('LoginPage')),
//   },
//   [profile]: [
//     {
//       path: PathConfig[profile].view,
//       component: () => import('@pages/Profile/scripts/profilePage').then(named('ProfilePage')),
//     },
//     {
//       path: PathConfig[profile].edit,
//       component: () => import('@pages/Profile/scripts/profilePage').then(named('ProfilePage')),
//     },
//   ],
//   [editPassword]: {
//     path: PathConfig[editPassword],
//     component: () => import('@pages/EditPassword/scripts/editPasswordPage').then(named('EditPasswordPage')),
//   },
//   [chat]: [
//     {
//       path: PathConfig[chat].notActive,
//       component: () => import('@pages/Chat/NotActive/scripts/notActiveChat').then(named('NotActiveChatPage')),
//     },
//     {
//       path: PathConfig[chat].active,
//       component: () => import('@pages/Chat/Active/scripts/activeChat').then(named('ActiveChatPage')),
//     },
//   ],
//   [error]: {
//     path: PathConfig[error],
//     component: () => import('@pages/Error/scripts/errorPage').then(named('ErrorPage')),
//   },
// };

export const Routers: IPageVariantsByLink = {
  [register]: { path: PathConfig[register], component: RegisterPage as unknown as BlockConstructor },
  [login]: { path: PathConfig[login], component: LoginPage as unknown as BlockConstructor },
  [profile]: [
    { path: PathConfig[profile].view, component: ProfilePage as unknown as BlockConstructor },
    { path: PathConfig[profile].edit, component: ProfilePage as unknown as BlockConstructor },
  ],
  [editPassword]: { path: PathConfig[editPassword], component: EditPasswordPage as unknown as BlockConstructor },
  [chat]: [
    { path: PathConfig[chat].notActive, component: NotActiveChatPage as unknown as BlockConstructor },
    { path: PathConfig[chat].active, component: ActiveChatPage as unknown as BlockConstructor },
  ],
  [error]: { path: PathConfig[error], component: ErrorPage as unknown as BlockConstructor },
};

export const getNavigationProps = (user: IUser): NavigationProps => {
  const hiddenPage = Object.values(user ?? {}).every((v) => !v) ? 'hidden' : undefined;
  const hiddenAuthPath = hiddenPage ? undefined : 'hidden';
  return {
    user,
    links: [
      // { path: PathConfig[homepage], text: 'Главная' },
      { path: PathConfig[register], text: 'Регистрация', hidden: hiddenAuthPath },
      { path: PathConfig[login], text: 'Вход', hidden: hiddenAuthPath },
      { path: PathConfig[profile].view, text: 'Профиль', hidden: hiddenPage },
      { path: PathConfig[editPassword], text: 'Изменить пароль', hidden: hiddenPage },
      { path: PathConfig[chat].notActive, text: 'Чат', hidden: hiddenPage },
      { path: PathConfig[error], text: 'Ошибка', hidden: 'hidden' },
    ],
    styles,
  };
};
