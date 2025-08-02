import Handlebars from 'handlebars';
import { navigation, type INavigation } from '../common/navigation';
import '../common/navigation/styles/navigation.scss';

export const addNavigation = (props: INavigation) => {
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');

    const navigationTmp = Handlebars.compile<INavigation>(navigation);
    const nav = navigationTmp(props);

    if (header) {
      header.innerHTML = nav;
    }
  });
};
