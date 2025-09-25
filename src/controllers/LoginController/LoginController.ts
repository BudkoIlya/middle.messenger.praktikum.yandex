import { AuthApi } from '@api';
import { Router } from '@common/Router';
import { PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignInRequest } from '@api/AuthApi';

import { BaseController } from '../BaseController';

class LoginControllerCrt extends BaseController<SignInRequest> {
  async getUser() {
    const user = await AuthApi.getUser();
    store.set('user', user);
  }

  private async _sign(data: SignInRequest) {
    await withTryCatch(async () => {
      await AuthApi.signIn(data);
      await this.getUser();

      new Router().push(PathConfig.messenger.notActive);
    });
  }

  onSubmit = (values: SignInRequest) => {
    this._sign(values);
  };
}

export const LoginController = new LoginControllerCrt();
