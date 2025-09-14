import type { Props } from '@common/Block/types';
import type { Link } from '@components';

import type { ChatItem } from './chatItem';

export interface IChatItems extends Props {
  // path: string;
  class?: string;
  chatItems?: ChatItem[];
  link?: Link;
}
