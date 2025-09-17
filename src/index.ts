import { HttpError } from '@api/HTTPTransport/HTTPTransport';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { LoaderOverlay, Navigation } from '@components';
import { LoginController } from '@controllers';

document.addEventListener('DOMContentLoaded', () => {
  new Navigation().mount('header');

  const overlay = new LoaderOverlay();
  overlay.mount('#overlay-root');

  (async () => {
    try {
      await LoginController.getUser();

      if (window.location.pathname === '/') {
        new Router().push(PathConfig[LinksPages.chat].notActive);
      }
    } catch (e) {
      if (e instanceof HttpError) {
        new Router().push(PathConfig[LinksPages.login]);
      }
    }
  })();
});
