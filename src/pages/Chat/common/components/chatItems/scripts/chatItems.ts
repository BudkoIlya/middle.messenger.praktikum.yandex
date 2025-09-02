import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { addRoutChangeListener } from '@utils';

import { getContext } from '../../../scripts';
import { ChatItem } from '../chatItem';
import { default as chatItemsTemplate } from '../chatItems.hbs';

import styles from '../styles/chatItems.module.scss';

export class ButtonText extends Block {
  constructor() {
    super('span', {});
  }

  render() {
    return 'Добавить';
  }
}

export class ChatItems extends Block {
  constructor({ active }: { active: boolean }) {
    const chatItems = getContext(active).chatItems.map((item) => new ChatItem(item));

    super(
      '',
      {
        chatItems,
        link: new Link({
          className: styles['chat__user-link'],
          path: PathConfig[LinksPages.profile].view,
          text: 'Имя Фамилия',
        }),
        input: new Input({
          name: 'search',
          placeholder: 'Поиск',
          class: styles['chat__search'],
        }),
        button: new Button({
          name: 'add',
          text: [new Img({ src: '/assets/add_btn.svg', alt: 'Добавить' }), new ButtonText()],
          className: styles['add_btn'],
          theme: null,
        }),
        styles,
      },
      [{ key: ElementsKeys.chatItems, template: chatItemsTemplate }],
    );
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
