import { Block } from '@common';
import { ProfileController } from '@controllers';
import { connect } from '@store';
import { addRoutChangeListener, checkValidationByFields } from '@utils';
import type { IUser } from '@store/UserStore/types';

import { ProfileComp } from '../templates';
import { getProps } from './helpers';
import type { ProfilePageProps } from './types';

class ProfilePageCtr extends Block<ProfilePageProps> {
  constructor() {
    super('', getProps());
  }

  private get _propsByMode() {
    return getProps(this.props.user);
  }

  forceUpdate = () => {
    super.forceUpdate(this._propsByMode);
  };

  private _setEvents() {
    const element = this.getContent();
    if (!element) return;

    const { inputs, buttons, imgInput } = this.props;
    const { saveBtn, editBtn, editPasswordBtn, cancelBtn, exitBtn } = buttons;

    exitBtn.setProps({
      events: {
        click: async () => {
          await ProfileController.logOut();
        },
      },
    });

    imgInput.setProps({
      events: {
        change: async (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (!files || files.length === 0 || !files[0]) return;

          const formData = new FormData();
          formData.append('avatar', files[0]);

          await ProfileController.changeAvatar(formData);
        },
      },
    });

    checkValidationByFields({
      root: element,
      inputs: inputs,
      button: saveBtn,
      onSubmit: async (values: IUser) => {
        const { id: _id, avatar: _avatar, ...rest } = values;
        await ProfileController.onSubmit(rest);
      },
    });
    addRoutChangeListener({ element: editBtn });
    addRoutChangeListener({ element: cancelBtn });
    addRoutChangeListener({ element: editPasswordBtn });
  }

  render(): string {
    return ProfileComp;
  }

  async afterRender() {
    this._setEvents();
  }
}

export const ProfilePage = connect(ProfilePageCtr, ({ user }) => getProps(user));
