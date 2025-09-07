import type { Props } from '@common/Block/types';
import type { Button, Img, Input } from '@components';

type ButtonKey = 'editBtn' | 'editPasswordBtn' | 'deleteBtn' | 'cancelBtn' | 'saveBtn';

export interface ProfilePageProps extends Props {
  avatar: Img;
  imgInput: Input;
  styles: CSSModuleClasses;
  isViewMode: boolean;
  inputs: Input[];
  buttons: { [K in ButtonKey]: Button };
}
