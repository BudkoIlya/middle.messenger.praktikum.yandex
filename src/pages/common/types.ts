import type { ElementsKeys } from '../../common/HandlebarsRegistration/types';
import type { RegisterPage } from '../Registration';
import type { HomePage } from '../Home';
import type { Links } from '../../components/header/scripts/contants';
import type { LoginPage } from '../Login';
import type { ProfilePage } from '../Profile';
import type { EditPasswordPage } from '../EditPassword';
import type { NotActiveChatPage } from '../Chat';
import type { ActiveChatPage } from '../Chat';
import type { ErrorPage } from '../Error';

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
