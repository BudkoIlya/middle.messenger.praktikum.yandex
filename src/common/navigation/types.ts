export interface INavigation {
  registerPath: string;
  loginPath: string;
  chatPath?: string;
  selectedChatPath?: string;
  profilePath?: string;
  editProfilePath?: string;
  editPasswordPath?: string;
  error404Path: string;
  error500Path?: string;
}