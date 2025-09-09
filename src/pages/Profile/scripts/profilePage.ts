import { Block } from '@common';
import { ProfileController } from '@controllers';
import { connect } from '@store';
import { addRoutChangeListener, checkValidationByFields } from '@utils';

import { ProfileComp } from '../templates';
import { getProps } from './helpers';
import type { ProfilePageProps } from './types';

class ProfilePageCtr extends Block<ProfilePageProps> {
  private _controller = new ProfileController();

  constructor() {
    super('', getProps(null));
  }

  private get _propsByMode() {
    return getProps(this.props.user);
  }

  forceUpdate = () => {
    super.forceUpdate(this._propsByMode);
  };

  dispatchComponentDidMount() {
    this.setProps(this._propsByMode);
    super.dispatchComponentDidMount();
  }

  private _setEvents() {
    const element = this.getContent();
    if (!element) return;

    const { inputs, buttons } = this.props;
    const { saveBtn, editBtn, editPasswordBtn, cancelBtn, exitBtn } = buttons;

    exitBtn.setProps({
      events: {
        click: async () => {
          await this._controller.logOut();
        },
      },
    });
    checkValidationByFields({ root: element, inputs, button: saveBtn });
    addRoutChangeListener({ element: editBtn });
    addRoutChangeListener({ element: cancelBtn });
    addRoutChangeListener({ element: editPasswordBtn });
  }

  render(): string {
    this._setEvents();

    return ProfileComp;
  }
}

export const ProfilePage = connect(ProfilePageCtr, (store) => getProps(store.user));
