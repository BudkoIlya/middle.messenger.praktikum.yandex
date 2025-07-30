import Handlebars from 'handlebars';
import { button } from '../common/button';
import '../common/button/styles/button.scss';

export const registerButton = () => {
  Handlebars.registerPartial('button', button);
};
