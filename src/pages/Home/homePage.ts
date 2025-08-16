import { Block } from '../../common/Block';

export class HomePage extends Block {
  constructor() {
    super('h1');

    const div = this.getContent();
    if (div) {
      div.className = 'mainPageTitle';
    }
  }

  render(): string {
    return 'Добро пожаловать';
  }
}
