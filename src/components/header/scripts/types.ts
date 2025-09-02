import type { LinksPages } from '@common/Router/PathConfig';
import type { BlockConstructor } from '@common/Router/Router';

interface Page {
  path: string;
  component: BlockConstructor;
}

type PageVariants2 = {
  profile: Page[];
  chat: Page[];
};

export type IPageVariantsByLink = {
  [K in LinksPages]: K extends keyof PageVariants2 ? PageVariants2[K] : Page;
};
