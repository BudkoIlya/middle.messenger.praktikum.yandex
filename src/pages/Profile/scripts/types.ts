import type { IUser } from '@api/AuthApi';
import type { Props } from '@common/Block/types';
import type { Button, Img, Input } from '@components';

type ButtonKey = 'editBtn' | 'editPasswordBtn' | 'exitBtn' | 'cancelBtn' | 'saveBtn';

export interface ProfilePageProps extends Props {
  user?: IUser;
  avatar: Img;
  imgInput: Input;
  isViewMode: boolean;
  inputs: Input[];
  buttons: { [K in ButtonKey]: Button };
}
