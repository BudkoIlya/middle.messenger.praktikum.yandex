import { Block } from '../../../common/Block';
import type { IMessage } from '../types';
import message from '../message.hbs';

export class Message extends Block {
  constructor(props: IMessage) {
    super('', props);
  }

  render(): string {
    return message;
  }
}
