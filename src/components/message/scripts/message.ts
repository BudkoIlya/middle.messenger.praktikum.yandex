import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import { Img } from '@components/img';

import message from '../message.hbs';
import type { IMessage } from '../types';

import styles from '../styles/message.module.scss';

export class Message extends Block {
  constructor(props: IMessage) {
    super(
      '',
      {
        ...props,
        img: new Img({
          src: '/assets/check_all.svg',
          alt: 'check_all',
          className: styles['message__check-img'],
        }),
        styles,
      },
      [{ key: ElementsKeys.message, template: message }],
    );
  }

  render(): string {
    return message;
  }
}
