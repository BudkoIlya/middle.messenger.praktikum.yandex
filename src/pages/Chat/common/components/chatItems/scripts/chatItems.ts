import { Block } from '../../../../../../common/Block';
import { ChatItem } from '../chatItem';
// import { type IChatItem } from '../chatItem';
import { getContext } from '../../../scripts';
// import { Input } from '../../../../../../components/input';
import { default as chatItemsTemplate } from '../chatItems.hbs';
import { Input } from '../../../../../../components/input';
import { Button } from '../../../../../../components/button';
import { Img } from '../../../../../../components/img/scripts/img';

interface IChatItems {
  id: string;
  path: string;
  [key: string]: unknown;
}

export class ChatItems extends Block {
  constructor(props: IChatItems) {
    const chatItems = getContext().chatItems.map((item) => new ChatItem(item));

    super('aside', {
      ...props,
      chatItems,
      input: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }),
      button: new Button({
        name: 'add',
        text: new Img({ src: '/assets/add_btn.svg', alt: 'Добавить' }),
        className: 'add_btn',
      }),
    });

    const aside = this.getContent();
    if (aside) {
      aside.classList.add('chat__sidebar');
    }
  }

  render(): string {
    return chatItemsTemplate;
  }
}
