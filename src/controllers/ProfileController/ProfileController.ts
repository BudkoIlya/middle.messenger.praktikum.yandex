import { LoginApi } from '@api';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/LoginApi';

import { BaseController } from '../BaseController';

class ProfileControllerCrt extends BaseController<SignInRequest> {
  async logOut() {
    await withTryCatch(async () => {
      await LoginApi?.logout();
      new Router().push(PathConfig[LinksPages.login]);
      store.clear('user');
    });
  }
}

export const ProfileController = new ProfileControllerCrt();
