import { LoginApi } from '@api';
import { Router } from '@common/Router';
import { LinksPages, PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/LoginApi';

import { BaseController } from '../BaseController';

class LoginControllerCrt extends BaseController<SignInRequest> {
  async getUser() {
    const user = await LoginApi.getUser();
    store.set('user', user);
  }

  private async _sign(data: SignInRequest): Promise<void> {
    await withTryCatch(async () => {
      await LoginApi.signIn(data);
      await this.getUser();

      new Router().push(PathConfig[LinksPages.chat].notActive);
    });
  }

  onSubmit(values: SignInRequest) {
    this._sign(values);
  }
}

export const LoginController = new LoginControllerCrt();
