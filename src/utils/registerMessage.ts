import Handlebars from 'handlebars';

import { message } from '../common/message';
import { registerImg } from './registerImg';
import '../common/message/styles/message.scss';


export const registerMessage = () => {
  registerImg();
  Handlebars.registerPartial('message', message);
};
