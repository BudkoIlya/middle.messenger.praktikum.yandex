import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { IUser } from '@store/UserStore/types';

enum Paths {
  changeAvatar = 'user/profile/avatar',
  user = 'auth/user',
}

class ProfileApiCrt extends HTTPTransport {
  changeAvatar(data: FormData) {
    return this.fetch<IUser>(Method.PUT, Paths.changeAvatar, { data: data });
  }
}

export const ProfileApi = new ProfileApiCrt();
