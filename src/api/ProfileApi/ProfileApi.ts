import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';

import { BASE_URL } from '../constants';
import type { IUser, SignInRequest } from '../LoginApi';

enum Paths {
  sign = `${BASE_URL}/auth/signin`,
  user = `${BASE_URL}/auth/user`,
}

class ProfileApiCrt extends HTTPTransport {
  sign(data: SignInRequest) {
    // console.log({ data });
    return this.fetch(Method.POST, Paths.sign, { data });
  }

  getUser() {
    return this.fetch<IUser>(Method.GET, Paths.user);
  }
}

export const ProfileApi = new ProfileApiCrt();
