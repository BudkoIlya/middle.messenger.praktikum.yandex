import { Block } from '../../../../../../common/Block';
import { ChatItem } from '../chatItem';
// import { type IChatItem } from '../chatItem';
import { getContext } from '../../../scripts';
// import { Input } from '../../../../../../components/input';
import { default as chatItemsTemplate } from '../chatItems.hbs?raw';
import { Input } from '../../../../../../components/input';
import { Button } from '../../../../../../components/button';

interface IChatItems {
  id: string;
  path: string;
  [key: string]: unknown;
}

export class ChatItems extends Block {
  constructor(props: IChatItems) {
    const chatItems = getContext().chatItems;
    const chatItemsChildren = chatItems.map((item) => ({ item: new ChatItem(item) }));

    super('aside', {
      ...props,
      chatItems: chatItemsChildren,
      input: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }),
      button: new Button({ name: 'qwe', text: 'qwe', class: 'class' }),
      // children: [
      //   ...chatItemsChildren,
      //   {
      //     item: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }),
      //   },
      //   { item: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }) },
      // ],
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
