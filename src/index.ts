import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { LoaderOverlay, Navigation } from '@components';
import { LoginController } from '@src/controllers';
import { connect } from '@store';
import type { IStore } from '@store/types';

document.addEventListener('DOMContentLoaded', () => {
  const mapUserToProps = (store: IStore) => ({ user: store.user });
  const ConnectedNavigation = connect(Navigation, mapUserToProps);
  new ConnectedNavigation().mount('header');

  const overlay = new LoaderOverlay();
  overlay.mount('#overlay-root');

  (async () => {
    try {
      await new LoginController().getUser();
    } catch (e) {
      new Router().push(PathConfig[LinksPages.login]);
    }
  })();
});
