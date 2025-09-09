import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';

import { BASE_URL } from '../constants';
import type { IUser, SignInRequest } from './types';

enum Paths {
  sign = `${BASE_URL}/auth/signin`,
  user = `${BASE_URL}/auth/user`,
}

export class ProfileApi extends HTTPTransport {
  sign(data: SignInRequest) {
    // console.log({ data });
    return this.fetch(Method.POST, Paths.sign, { data });
  }

  getUser() {
    return this.fetch<IUser>(Method.GET, Paths.user);
  }
}
