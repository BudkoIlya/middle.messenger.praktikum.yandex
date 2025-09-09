import { LoginApi } from '@api';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/LoginApi';

import { BaseController } from '../BaseController';

export class ProfileController extends BaseController<SignInRequest> {
  private _loginApi?: LoginApi;

  constructor() {
    super();
    this._loginApi = new LoginApi();
  }

  async logOut() {
    await withTryCatch(async () => {
      await this._loginApi?.logout();
      new Router().push(PathConfig[LinksPages.login]);
      store.clear('user');
    });
  }
}
