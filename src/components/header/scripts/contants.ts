import { PathConfig } from '@common/Router/PathConfig';
import type { BlockConstructor } from '@common/Router/Router';
import type { IUser } from '@store/UserStore/types';

import type { IPageVariantsByLink, NavigationProps } from './types';

import styles from '../styles/navigation.module.scss';

export const named = (exportName: string) => (m: Record<string, unknown>) => ({
  default: m[exportName] as BlockConstructor,
});

export const Routers: IPageVariantsByLink = {
  register: {
    path: PathConfig.register,
    component: () => import('@pages/Registration/scripts/registerPage').then(named('RegisterPage')),
  },
  login: {
    path: PathConfig.login,
    component: () => import('@pages/Login/scripts/loginPage').then(named('LoginPage')),
  },
  settings: [
    {
      path: PathConfig.settings.view,
      component: () => import('@pages/Profile/scripts/profilePage').then(named('ProfilePage')),
    },
    {
      path: PathConfig.settings.edit,
      component: () => import('@pages/Profile/scripts/profilePage').then(named('ProfilePage')),
    },
  ],
  editPassword: {
    path: PathConfig.editPassword,
    component: () => import('@pages/EditPassword/scripts/editPasswordPage').then(named('EditPasswordPage')),
  },
  messenger: [
    {
      path: PathConfig.messenger.notActive,
      component: () => import('@pages/Chat/NotActive/scripts/notActiveChat').then(named('NotActiveChatPage')),
    },
    {
      path: PathConfig.messenger.active,
      component: () => import('@pages/Chat/Active/scripts/activeChat').then(named('ActiveChatPage')),
    },
  ],
  error: {
    path: PathConfig.error,
    component: () => import('@pages/Error/scripts/errorPage').then(named('ErrorPage')),
  },
};

export const getNavigationProps = (user?: IUser): NavigationProps => {
  const hiddenPage = Object.values(user ?? {}).every((v) => !v) ? 'hidden' : undefined;
  const hiddenAuthPath = hiddenPage ? undefined : 'hidden';
  return {
    user,
    links: [
      { path: PathConfig.register, text: 'Регистрация', hidden: hiddenAuthPath },
      { path: PathConfig.login, text: 'Вход', hidden: hiddenAuthPath },
      { path: PathConfig.settings.view, text: 'Профиль', hidden: hiddenPage },
      { path: PathConfig.editPassword, text: 'Изменить пароль', hidden: 'hidden' },
      { path: PathConfig.messenger.notActive, text: 'Чат', hidden: hiddenPage },
      { path: PathConfig.error, text: 'Ошибка', hidden: 'hidden' },
    ],
    styles,
  };
};
