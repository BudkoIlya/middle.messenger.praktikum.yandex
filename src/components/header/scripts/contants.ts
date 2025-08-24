import type { INavigation } from '../template';

export enum Links {
  register = 'register',
  homepage = 'homepage',
  login = 'login',
  profile = 'profile',
  editPassword = 'editPassword',
  chat = 'chat',
  activeChat = 'activeChat',
  error404 = 'error404',
  error500 = 'error500',
}

interface Page {
  id: Links;
  path: string;
}

type PageVariants = {
  [Links.profile]: { view: Page; edit: Page };
};

export type IPageVariantsByLink = {
  [K in Links]: K extends keyof PageVariants ? PageVariants[K] : Page;
};

export const Paths: IPageVariantsByLink = {
  [Links.homepage]: { id: Links.homepage, path: '/' },
  [Links.register]: { id: Links.register, path: `/${Links.register}` },
  [Links.login]: { id: Links.login, path: `/${Links.login}` },
  [Links.profile]: {
    view: { id: Links.profile, path: `/${Links.profile}?mode=view` },
    edit: { id: Links.profile, path: `/${Links.profile}?mode=edit` },
  },
  [Links.editPassword]: { id: Links.editPassword, path: `/${Links.editPassword}` },
  [Links.chat]: { id: Links.chat, path: `/${Links.chat}` },
  [Links.activeChat]: { id: Links.activeChat, path: `/${Links.activeChat}` },
  [Links.error404]: { id: Links.error404, path: `/${Links.error404}` },
  [Links.error500]: { id: Links.error500, path: `/${Links.error500}` },
};

export const NAVIGATION_CONTEXT: { links: INavigation[] } = {
  links: [
    { ...Paths[Links.homepage], text: 'Главная' },
    { ...Paths[Links.register], text: 'Регистрация' },
    { ...Paths[Links.login], text: 'Вход' },
    { ...Paths[Links.profile].view, text: 'Профиль' },
    { ...Paths[Links.editPassword], text: 'Изменить пароль' },
    { ...Paths[Links.chat], text: 'Чат' },
    { ...Paths[Links.activeChat], text: 'Выбранный чат' },
    { ...Paths[Links.error404], text: '404' },
    { ...Paths[Links.error500], text: '500' },
  ],
};
