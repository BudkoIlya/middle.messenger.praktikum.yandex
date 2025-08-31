import { Block } from '@common';

import { ErrorComp } from '../template';

import styles from '../styles/styles.module.scss';

export class ErrorPage extends Block {
  constructor(props: { text: string }) {
    super('', { ...props, styles });
  }

  protected render(): string {
    return ErrorComp;
  }
}
