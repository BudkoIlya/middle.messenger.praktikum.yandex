import { Block } from '@common';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { CONTEXT } from '@pages/Registration/scripts/context';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { Props } from '@common/Block/types';

import { RegisterPageComp } from '../templates';

import styles from '../styles/styles.module.scss';

export interface RegisterPageProps extends Props {
  styles: CSSModuleClasses;
  inputs: Input[];
  link: Link;
  button: Button;
}

export class RegisterPage extends Block<RegisterPageProps> {
  constructor() {
    const inputs = CONTEXT.inputs.map((el) => new Input(el));
    const link = new Link({ path: PathConfig[LinksPages.login], className: styles.loginLink, text: 'Вход' });

    super('', {
      inputs,
      button: new Button(CONTEXT.button),
      link,
      styles,
    });
  }

  componentDidMount(): void {
    const element = this.getContent();
    if (!element) return;

    const inputs = this.props.inputs;
    const button = this.props.button;
    const link = this.props.link;
    checkValidationByFields({ root: element, inputs, button });
    addRoutChangeListener({ element: link });
  }

  render(): string {
    return RegisterPageComp;
  }
}
