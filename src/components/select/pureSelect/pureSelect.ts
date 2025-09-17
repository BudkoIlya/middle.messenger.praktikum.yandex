import { Block } from '@common';
import { ElementsKeys } from '@common/HandlebarsRegistration/types';
import select from '@components/select/template.hbs';
import type { IOption } from '@components/select/types';
import type { ISelect } from '@src/components';

import pureSelect from './template.hbs';

import styles from './pureSelect.module.scss';

export class PureSelect extends Block {
  constructor(props: Omit<ISelect, 'search'>) {
    super('', { styles, ...props }, [{ key: ElementsKeys.select, template: select }]);
  }

  render(): string {
    return pureSelect;
  }

  afterRender() {
    if (!!this.props.events) return;

    this.setProps({
      events: {
        change: (e) => {
          const value = (e.target as HTMLSelectElement).value;
          const options = (this.props.options as IOption[])?.map((el) => ({
            ...el,
            selected: String(value) === String(el.value) ? 'selected' : undefined,
          }));
          this.setProps({ hasValue: !!value, options });
        },
      },
    });
  }
}
