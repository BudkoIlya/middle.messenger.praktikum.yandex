import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { IUser } from '@store/UserStore/types';

import type { SignInRequest } from '../AuthApi';

enum Paths {
  sign = 'auth/signin',
  user = 'auth/user',
}

class ProfileApiCrt extends HTTPTransport {
  sign(data: SignInRequest) {
    return this.fetch(Method.POST, Paths.sign, { data });
  }

  getUser() {
    return this.fetch<IUser>(Method.GET, Paths.user);
  }
}

export const ProfileApi = new ProfileApiCrt();
