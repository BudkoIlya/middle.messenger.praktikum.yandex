import { Block } from '../../../../../../common/Block';
import { ChatItem, type IChatItem } from '../chatItem';
import { getContext } from '../../../scripts';
import { Input } from '../../../../../../components/input';

interface IChatItems {
  id: string;
  path: string;
  [key: string]: unknown;
}

export class ChatItems extends Block<IChatItems> {
  constructor(props: IChatItems) {
    const chatItems = getContext().chatItems as IChatItem[];
    const chatItemsChildren = chatItems.map((item) => ({ item: new ChatItem(item) }));

    super('label', {
      props,
      children: [
        ...chatItemsChildren,
        { item: new Input({ name: 'search', placeholder: 'Поиск', class: 'chat__search' }) },
      ],
    });

    const label = this.getContent();
    if (label) {
      label.className = 'label';
    }
  }

  render(): string {
    return '';
  }
}
