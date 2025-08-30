import type { ElementsKeys } from '@common/HandlebarsRegistration/types';
import type { Links } from '@components/header/scripts/contants';
import type {
  ActiveChatPage,
  EditPasswordPage,
  ErrorPage,
  HomePage,
  LoginPage,
  NotActiveChatPage,
  ProfilePage,
  RegisterPage,
} from '@pages';

export type Components = Exclude<ElementsKeys, 'header'>;

export type Pages =
  | RegisterPage
  | HomePage
  | LoginPage
  | ProfilePage
  | EditPasswordPage
  | ActiveChatPage
  | NotActiveChatPage
  | ErrorPage;

export type IPageByLink = Record<Links, () => { components?: Components[] | null; createPage: () => Pages }>;
