import Handlebars from 'handlebars';
import { navigation, type INavigation } from '../common/navigation';
import '../common/navigation/styles/navigation.scss';

export const addNavigation = ({
  registerPath,
  loginPath,
  chatPath,
  selectedChatPath,
  error404Path,
  error500Path,
}: INavigation) => {
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');

    const navigationTmp = Handlebars.compile<INavigation>(navigation);
    const nav = navigationTmp({
      registerPath,
      loginPath,
      chatPath,
      selectedChatPath,
      profilePath: '',
      editProfilePath: '',
      editPasswordPath: '',
      error500Path,
      error404Path,
    });

    if (header) {
      header.innerHTML = nav;
    }
  });
};
