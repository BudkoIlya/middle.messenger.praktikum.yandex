import { AuthApi, ProfileApi } from '@api';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/AuthApi';

import { BaseController } from '../BaseController';

class ProfileControllerCrt extends BaseController<SignInRequest> {
  async logOut() {
    await withTryCatch(async () => {
      await AuthApi?.logout();
      new Router().push(PathConfig[LinksPages.login]);
      store.clear();
    });
  }

  async changeAvatar(data: FormData) {
    await withTryCatch(async () => {
      const user = await ProfileApi.changeAvatar(data);
      store.set('user', user);
    });
  }
}

export const ProfileController = new ProfileControllerCrt();
