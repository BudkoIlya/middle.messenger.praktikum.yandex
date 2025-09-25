import type { Props } from '@common/Block/types';
import type { Links } from '@common/Router/PathConfig';
import type { BlockConstructor } from '@common/Router/Router';
import type { IUser } from '@store/UserStore/types';

export type ComponentLoader = () => Promise<{ default: BlockConstructor }>;

export interface Page {
  path: string;
  component: ComponentLoader;
}

type PageVariants = {
  settings: Page[];
  messenger: Page[];
};

export type IPageVariantsByLink = {
  [K in Links]: K extends keyof PageVariants ? PageVariants[K] : Page;
};

export interface NavigationProps extends Props {
  user?: IUser;
  links: { path: string; text: string; hidden?: 'hidden' }[];
  styles: CSSModuleClasses;
}
