import { AuthApi, ProfileApi } from '@api';
import { Router } from '@common/Router';
import { PathConfig } from '@common/Router/PathConfig';
import { withTryCatch } from '@src/utils/withTryCatch';
import { store } from '@store';
import type { PasswordRequest } from '@api/ProfileApi/ProfileApi';
import type { IUser } from '@store/UserStore/types';

import { BaseController } from '../BaseController';

type ISubmitData = Omit<IUser, 'avatar' | 'id'>;

class ProfileControllerCrt extends BaseController<ISubmitData> {
  async logOut() {
    await withTryCatch(async () => {
      await AuthApi?.logout();
      new Router().push(PathConfig.login);
      store.clear();
    });
  }

  async changeAvatar(data: FormData) {
    await withTryCatch(async () => {
      const user = await ProfileApi.changeAvatar(data);
      store.set('user', user);
    });
  }

  onSubmit = async (data: ISubmitData) => {
    await withTryCatch(async () => {
      const user = await ProfileApi.updateProfile(data);
      store.set('user', user);
      new Router().push(PathConfig.settings.view);
    });
  };

  updatePassword = async (data: PasswordRequest) => {
    await ProfileApi.updatePassword(data);
  };
}

export const ProfileController = new ProfileControllerCrt();
