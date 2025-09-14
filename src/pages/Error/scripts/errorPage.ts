import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';
import type { Props } from '@common/Block/types';

import { ErrorComp } from '../template';

import styles from '../styles/styles.module.scss';

interface IErrorPage extends Props {
  text?: string;
}

export class ErrorPage extends Block<IErrorPage> {
  constructor() {
    const statusCode = (() => {
      const parts = window.location.pathname.split('/'); // ["", "chat", "4646"]
      return parts[parts.length - 1];
    })();

    super('', { styles, text: statusCode }, [{ key: LinksPages.error, template: ErrorComp }]);
  }

  render(): string {
    return ErrorComp;
  }
}
