import { LoginApi } from '@api';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/LoginApi';

import { BaseController } from '../BaseController';

export class LoginController extends BaseController<SignInRequest> {
  private _api?: LoginApi;

  constructor() {
    super();
    this._api = new LoginApi();
  }

  async getUser() {
    if (!store.state.user?.id) {
      const user = await this._api?.getUser();
      store.set('user', user);
    }
  }

  private async _sign(data: SignInRequest): Promise<void> {
    await withTryCatch(async () => {
      await this._api?.signIn(data);
      await this.getUser();

      new Router().push(PathConfig[LinksPages.chat].notActive);
    });
  }

  onSubmit(values: SignInRequest) {
    this._sign(values);
  }
}
