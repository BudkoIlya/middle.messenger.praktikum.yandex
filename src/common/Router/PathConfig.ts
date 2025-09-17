const prefixPath =
  (import.meta?.env?.MODE ?? import.meta?.env?.NODE_ENV) === 'production' ? '/praktikumchat.netlify.app' : '';

export type Links = 'register' | 'login' | 'settings' | 'editPassword' | 'messenger' | 'error';

export const LinksPages: Record<Links, string> = {
  register: `${prefixPath}/sign-up`,
  login: `${prefixPath}/`,
  settings: `${prefixPath}/settings`,
  editPassword: `${prefixPath}/settings/password`,
  messenger: `${prefixPath}/messenger`,
  error: `${prefixPath}/error`,
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
