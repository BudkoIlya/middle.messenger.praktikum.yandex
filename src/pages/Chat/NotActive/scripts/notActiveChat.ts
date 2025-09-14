import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';
import { ChatController } from '@controllers/ChatController';
import { connect } from '@store';
import type { IUser } from '@api/LoginApi';
import type { Props } from '@common/Block/types';
import type { ChatItemsCrt } from '@pages/Chat/common/components/chatItems/scripts';

import { ChatItems } from '../../common/components/chatItems';
import { NotActivePageComp } from '../templates';

import styles from '../styles/styles.module.scss';

interface INotActiveChatPageCrt extends Props {
  chatItems: ChatItemsCrt;
  styles: CSSModuleClasses;
  user?: IUser;
}

class NotActiveChatPageCrt extends Block<INotActiveChatPageCrt> {
  constructor() {
    super('', { chatItems: new ChatItems(), styles }, [{ key: LinksPages.chat, template: NotActivePageComp }]);
  }

  async dispatchComponentDidMount() {
    await ChatController.getChats();
    super.dispatchComponentDidMount();
  }

  render(): string {
    return NotActivePageComp;
  }
}

export const NotActiveChatPage = connect(NotActiveChatPageCrt, ({ user }) => ({ user }));
