import type { ElementsKeys } from '../../common/HandlebarsRegistration/types';
import type { RegisterPage } from '../Registration';
import type { HomePage } from '../Home';
import type { Links } from '../../components/header/scripts/contants';
import type { LoginPage } from '../Login';
import type { ProfilePage } from '../Profile';

export type Components = Exclude<ElementsKeys, 'header'>;

export type Pages = RegisterPage | HomePage | LoginPage | ProfilePage;

export type IPageByLink = Record<Links, () => { components?: Components[] | null; createPage: () => Pages }>;
