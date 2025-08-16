import type { INavigation } from '../template';

export enum Links {
  register = 'register',
  homepage = 'homepage',
  login = 'login',
  profile = 'profile',
  // chat = 'chat',
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
};

export const NAVIGATION_CONTEXT: { links: INavigation[] } = {
  links: [
    { ...Paths[Links.homepage], text: 'Главная' },
    { ...Paths[Links.register], text: 'Регистрация' },
    { ...Paths[Links.login], text: 'Вход' },
    { ...Paths[Links.profile].view, text: 'Профиль' },
    // { ...Paths[Links.chat], text: 'Чат' },
  ],
};
