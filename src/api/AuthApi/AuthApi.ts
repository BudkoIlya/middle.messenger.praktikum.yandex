import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { IUser } from '@store/UserStore/types';

import type { SignInRequest, SignUpRequest } from './types';

enum Paths {
  signIn = 'auth/signin',
  signUp = 'auth/signup',
  logout = 'auth/logout',
  user = 'auth/user',
}

class AuthApiCrt extends HTTPTransport {
  signIn(data: SignInRequest) {
    return this.fetch(Method.POST, Paths.signIn, { data });
  }

  logout() {
    return this.fetch(Method.POST, Paths.logout);
  }

  getUser() {
    return this.fetch<IUser>(Method.GET, Paths.user);
  }

  signUp(data: SignUpRequest) {
    return this.fetch<{ id: number }>(Method.POST, Paths.signUp, { data });
  }
}

export const AuthApi = new AuthApiCrt();
