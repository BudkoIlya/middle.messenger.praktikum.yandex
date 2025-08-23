import { Block } from '../../common/Block';

export class HomePage extends Block<{ id: string }> {
  constructor() {
    super('h1', { props: { id: '' } });

    const div = this.getContent();
    if (div) {
      div.className = 'mainPageTitle';
    }
  }

  render(): string {
    return 'Добро пожаловать';
  }
}
