import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';

import { BASE_URL } from '../constants';
import type { IUser, SignInRequest } from './types';

enum Paths {
  signIn = `${BASE_URL}/auth/signin`,
  logout = `${BASE_URL}/auth/logout`,
  user = `${BASE_URL}/auth/user`,
}

class LoginApiCrt extends HTTPTransport {
  signIn(data: SignInRequest) {
    return this.fetch(Method.POST, Paths.signIn, { data });
  }

  logout() {
    return this.fetch(Method.POST, Paths.logout);
  }

  getUser() {
    return this.fetch<IUser>(Method.GET, Paths.user);
  }
}

export const LoginApi = new LoginApiCrt();
