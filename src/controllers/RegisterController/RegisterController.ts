import { AuthApi } from '@api';
import { Router } from '@common/Router';
import { PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { SignUpRequest } from '@api/AuthApi';

import { BaseController } from '../BaseController';

interface SignUpRequestConfirmPassword extends SignUpRequest {
  confirm_password: string;
}

class RegisterControllerCrt extends BaseController<SignUpRequestConfirmPassword> {
  async getUser() {
    const user = await AuthApi.getUser();
    store.set('user', user);
  }

  private async _gerUserAndRedirect() {
    await withTryCatch(async () => {
      await this.getUser();

      new Router().push(PathConfig.messenger.notActive);
    });
  }

  private async _signup(data: SignUpRequest) {
    await withTryCatch(async () => {
      await AuthApi.signUp(data); // После регистрации сразу происходит вход
      await this._gerUserAndRedirect();
    });
  }

  onSubmit = ({ confirm_password, password, ...rest }: SignUpRequestConfirmPassword) => {
    if (confirm_password !== password) {
      window.alert('Пароли не совпадают');
      return;
    }
    this._signup({ ...rest, password });
  };
}

export const RegisterController = new RegisterControllerCrt();
