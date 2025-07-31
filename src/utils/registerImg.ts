import Handlebars from 'handlebars';
import { img } from '../common/img';

export const registerImg = () => {
  Handlebars.registerPartial('img', img);
};
