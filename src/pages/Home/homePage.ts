import { Block } from '@common/Block';

import styles from './styles.module.scss';

export class HomePage extends Block {
  constructor() {
    super('', { styles });
  }

  render(): string {
    return `<h1 class="{{styles.title}}">Добро пожаловать</h1>`;
  }
}
