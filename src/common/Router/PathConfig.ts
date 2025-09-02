export enum LinksPages {
  register = 'register',
  homepage = 'homepage',
  login = 'login',
  profile = 'profile',
  editPassword = 'editPassword',
  chat = 'chat',
  error = 'error',
}

export const PathConfig = {
  [LinksPages.homepage]: '/',
  [LinksPages.login]: `/${LinksPages.login}`,
  [LinksPages.register]: `/${LinksPages.register}`,
  [LinksPages.profile]: { view: `/${LinksPages.profile}?mode=view`, edit: `/${LinksPages.profile}?mode=edit` },
  [LinksPages.editPassword]: `/${LinksPages.editPassword}`,
  [LinksPages.chat]: {
    notActive: `/${LinksPages.chat}`,
    active: `/${LinksPages.chat}/:id`,
  },
  [LinksPages.error]: `/${LinksPages.error}?type`,
};
