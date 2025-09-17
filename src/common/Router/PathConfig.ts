export enum LinksPages {
  register = 'sign-up',
  login = '/',
  profile = 'settings',
  editPassword = 'settings/password',
  chat = 'messenger',
  error = 'error',
}

export const PathConfig = {
  [LinksPages.login]: LinksPages.login,
  [LinksPages.register]: `/${LinksPages.register}`,
  [LinksPages.profile]: { view: `/${LinksPages.profile}?mode=view`, edit: `/${LinksPages.profile}?mode=edit` },
  [LinksPages.editPassword]: `/${LinksPages.editPassword}`,
  [LinksPages.chat]: {
    notActive: `/${LinksPages.chat}`,
    active: `/${LinksPages.chat}/:id`,
  },
  [LinksPages.error]: `/${LinksPages.error}/:code`,
};
