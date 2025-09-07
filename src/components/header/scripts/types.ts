import type { IUser } from '@api/LoginApi';
import type { Props } from '@common/Block/types';
import type { LinksPages } from '@common/Router/PathConfig';
import type { BlockConstructor } from '@common/Router/Router';

export type ComponentLoader = () => Promise<{ default: BlockConstructor }>;

export interface Page {
  path: string;
  component: ComponentLoader;
}

type PageVariants2 = {
  profile: Page[];
  chat: Page[];
};

export type IPageVariantsByLink = {
  [K in LinksPages]: K extends keyof PageVariants2 ? PageVariants2[K] : Page;
};

export interface NavigationProps extends Props {
  user: IUser | null;
  links: unknown;
  styles: CSSModuleClasses;
}
