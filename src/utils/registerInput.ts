import Handlebars from 'handlebars';
import { input } from '../common/input';
import '../common/input/styles/input.scss';

export const registerInput = () => {
  Handlebars.registerPartial('input',input);
};
