export type Links = 'register' | 'login' | 'settings' | 'editPassword' | 'messenger' | 'error';

export const LinksPages: Record<Links, string> = {
  register: `/sign-up`,
  login: `/`,
  settings: `/settings`,
  editPassword: `/settings/password`,
  messenger: `/messenger`,
  error: `/error`,
} as const;

type IPathConfig = {
  register: string;
  login: string;
  settings: { view: string; edit: string };
  editPassword: string;
  messenger: { notActive: string; active: string };
  error: string;
};

export const PathConfig: IPathConfig = {
  register: LinksPages.register,
  login: LinksPages.login,
  settings: {
    view: `${LinksPages.settings}?mode=view`,
    edit: `${LinksPages.settings}?mode=edit`,
  },
  editPassword: LinksPages.editPassword,
  messenger: {
    notActive: LinksPages.messenger,
    active: `${LinksPages.messenger}/:id`,
  },
  error: `${LinksPages.error}/:code`,
} as const;
