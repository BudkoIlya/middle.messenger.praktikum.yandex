import { Block } from '../../../../../../common/Block';
import { ChatItem } from '../chatItem';
// import { type IChatItem } from '../chatItem';
import { getContext } from '../../../scripts';
// import { Input } from '../../../../../../components/input';
import { default as chatItemsTemplate } from '../chatItems.hbs';
import { Input } from '../../../../../../components/input';
import { Button } from '../../../../../../components/button';
import { Img } from '../../../../../../components/img/scripts/img';
import { Link } from '../../../../../../components/link';
import { Paths } from '../../../../../../components/header/scripts/contants';
import { addRoutChangeListener } from '../../../../../../utils';

export class ButtonText extends Block {
  constructor() {
    super('span', {});
  }

  render() {
    return 'Добавить';
  }
}

export class ChatItems extends Block {
  constructor() {
    const chatItems = getContext().chatItems.map((item) => new ChatItem(item));

    super('aside', {
      chatItems,
      link: new Link({
        className: 'chat__user-link',
        id: Paths.profile.view.id,
        path: Paths.profile.view.path,
        text: 'Имя Фамилия',
      }),
      input: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }),
      button: new Button({
        name: 'add',
        text: [new Img({ src: '/assets/add_btn.svg', alt: 'Добавить' }), new ButtonText()],
        className: 'add_btn',
      }),
    });

    const aside = this.getContent();
    if (aside) {
      aside.classList.add('chat__sidebar');
    }
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const link = this.props.link as Link;
    addRoutChangeListener({ element: link });
  }

  render(): string {
    return chatItemsTemplate;
  }
}
