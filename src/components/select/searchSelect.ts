import { Block } from '@common/Block';
import { PureSelect } from '@components/select/pureSelect/pureSelect';
import { Input } from '@src/components/input';
import type { Props } from '@common/Block/types';

import select from './template.hbs';
import type { ISelect } from './types';

import styles from './searchSelect.module.scss';

interface ISearchSelect extends Props {
  searchInput?: Input;
  pureSelect?: PureSelect;
}

export class SearchSelect extends Block<ISearchSelect> {
  constructor({ search, ...rest }: ISelect) {
    super('', {
      styles,
      searchInput: search ? new Input({ name: 'search', placeholder: 'Поиск...' }) : undefined,
      pureSelect: new PureSelect({ ...rest }),
    });
  }

  render(): string {
    return select;
  }
}
