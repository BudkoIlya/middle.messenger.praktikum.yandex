import { Block } from '@common';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { RegisterController } from '@controllers/RegisterController';
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

  render(): string {
    return RegisterPageComp;
  }

  afterRender() {
    const element = this.getContent();
    if (!element) return;

    const { inputs, button, link } = this.props;

    checkValidationByFields({ root: element, inputs, button, onSubmit: RegisterController.onSubmit });
    addRoutChangeListener({ element: link });
  }
}
