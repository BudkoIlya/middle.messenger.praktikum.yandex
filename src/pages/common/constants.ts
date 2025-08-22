import type { Template } from 'handlebars';

import type { Components, IPageByLink } from './types';
import { ElementsKeys } from '../../common/HandlebarsRegistration/types';
import { Links } from '../../components/header/scripts/contants';
import { RegisterPage } from '../Registration';
import { HomePage } from '../Home';
import { LoginPage } from '../Login';
import { ProfilePage } from '../Profile';
import { button as btnComp, input as inputCom, img as imgComp } from '../../components';
import { EditPasswordPage } from '../EditPassword';
import { ActiveChatPage, NotActiveChatPage } from '../Chat';
import { chatItems as chatItemsComp, chatItem as chatItemComp, message as messageComp } from '../Chat/common';

const { input, button, img, chatItems, chatItem, message } = ElementsKeys;
const { register, homepage, login, profile, editPassword, chat, activeChat } = Links;

export const COMPONENTS_BY_KEY: Record<Components, Template<unknown>> = {
  [input]: inputCom,
  [button]: btnComp,
  [img]: imgComp,
  [message]: messageComp,
  [chatItem]: chatItemComp,
  [chatItems]: chatItemsComp,
};

export const PAGE_STYLES: Record<Links, () => Promise<unknown>> = {
  [register]: () => import('../Registration/styles/styles.scss'),
  [homepage]: () => import('../Home/styles.scss'),
  [login]: () => import('../Login/styles/styles.scss'),
  [profile]: () => import('../Profile/styles/styles.scss'),
  [editPassword]: () => import('../EditPassword/styles/styles.scss'),
  [chat]: () => import('../Chat/NotActive/styles/styles.scss'),
  [activeChat]: () => import('../Chat/Active/styles/styles.scss'),
};

export const COMPONENT_STYLES: Partial<Record<ElementsKeys, () => Promise<unknown>>> = {
  [input]: () => import('../../components/input/styles/input.scss'),
  [button]: () => import('../../components/button/styles/button.scss'),
  [chatItem]: () => import('../../pages/Chat/common/templates/chatItems/chatItem/styles/chatItem.scss'),
  [message]: () => import('../../pages/Chat/common/templates/message/styles/styles.scss'),
};

export const PAGE_BY_LINK: IPageByLink = {
  [register]: () => ({ components: [button, input], createPage: () => new RegisterPage() }),
  [homepage]: () => ({ createPage: () => new HomePage() }),
  [login]: () => ({ components: [button, input], createPage: () => new LoginPage() }),
  [profile]: () => ({ components: [button, input, img], createPage: () => new ProfilePage() }),
  [editPassword]: () => ({ components: [button, input, img], createPage: () => new EditPasswordPage() }),
  [activeChat]: () => ({
    components: [button, input, img, message, chatItem, chatItems],
    createPage: () => new ActiveChatPage(),
  }),
  [chat]: () => ({
    components: [button, input, img, message, chatItem, chatItems],
    createPage: () => new NotActiveChatPage(),
  }),
};
