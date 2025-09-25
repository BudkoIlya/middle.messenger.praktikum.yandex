import { HTTPTransport } from '@api/HTTPTransport/HTTPTransport';
import { Method } from '@api/HTTPTransport/types';
import type { IUser } from '@store/UserStore/types';

enum Paths {
  changeAvatar = 'user/profile/avatar',
  profile = 'user/profile',
  password = 'user/password',
}

export interface PasswordRequest {
  oldPassword: string;
  newPassword: string;
}

class ProfileApiCrt extends HTTPTransport {
  changeAvatar(data: FormData) {
    return this.fetch<IUser>(Method.PUT, Paths.changeAvatar, { data: data });
  }

  updateProfile(data: Omit<IUser, 'id' | 'avatar'>) {
    return this.fetch<IUser>(Method.PUT, Paths.profile, { data: data });
  }

  updatePassword(data: PasswordRequest) {
    return this.fetch(Method.PUT, Paths.password, { data });
  }
}

export const ProfileApi = new ProfileApiCrt();
