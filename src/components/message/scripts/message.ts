import { Block } from '@common';

import message from '../message.hbs';
import type { IMessage } from '../types';

export class Message extends Block {
  constructor(props: IMessage) {
    super('', props);
  }

  render(): string {
    return message;
  }
}
