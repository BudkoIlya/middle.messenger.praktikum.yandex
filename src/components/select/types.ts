import type { Block } from '@common';
import type { Events, Props } from '@common/Block/types';
import type { Input } from '@src/components';

export interface IOption extends Props {
  value?: string | number;
  text?: string | number;
}

export interface ISelect extends Props {
  name: string;
  disabled?: string;
  class?: string;
  placeholder?: string;
  value?: string;
  events?: Events;
  label?: string | Block;
  helpTextClass?: string;
  error?: boolean;
  options?: IOption[];
  search?: boolean;
  searchInput?: Input;
  hasValue?: boolean;
}
