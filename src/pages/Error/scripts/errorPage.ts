import { Block } from '@common';
import { LinksPages } from '@common/Router/PathConfig';

import { ErrorComp } from '../template';

import styles from '../styles/styles.module.scss';

export class ErrorPage extends Block {
  constructor() {
    //TODO: здесь надо как-то прокидывать ошибку
    super('', { styles }, [{ key: LinksPages.error, template: ErrorComp }]);
  }

  render(): string {
    return ErrorComp;
  }
}
