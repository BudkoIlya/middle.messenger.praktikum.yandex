import { Block } from '@common';
import { Button } from '@components/button';
import { Img } from '@components/img';
import { Select } from '@components/select';
import { ChatController } from '@controllers/ChatController';
import { store } from '@store';
import type { Props } from '@common/Block/types';
import type { IOption } from '@components/select/types';
import type { IUser } from '@store/UserStore/types';

import addUserImg from './template.hbs';

import styles from './addUserImg.module.scss';

interface IAddUserImg extends Props {
  img: Img;
  addUser: { select: Select; apply: Button };
  deleteUser: { select: Select; apply: Button };
  show?: boolean;
  chatId?: number;
  cancel: Button;
  chatUsers?: IUser[];
}

export class AddUserImg extends Block<IAddUserImg> {
  constructor({ chatId, chatUsers }: { chatId?: number; chatUsers?: IUser[] } = {}) {
    super('', {
      styles,
      img: new Img({
        alt: 'Добавить',
        src: '/assets/dots.svg',
        className: styles.addUserImg,
      }),
      addUser: {
        select: new Select({ name: 'addUser', search: true, class: styles.select }),
        apply: new Button({ text: 'Добавить', theme: null }),
      },
      deleteUser: {
        select: new Select({ name: 'addUser', class: styles.select }),
        apply: new Button({ text: 'Удалить', theme: null }),
      },
      cancel: new Button({ text: 'Отменить', theme: null }),
      chatId,
      chatUsers,
    });
  }

  render() {
    return addUserImg;
  }

  private _getOptions(users?: IUser[]): IOption[] {
    const arr = users ?? this.props.chatUsers;

    return (
      arr?.reduce<IOption[]>((acc, u) => {
        // условие удаления: например, игнорируем пользователей без логина
        if (u.id === store.state.user.id) return acc;

        acc.push({
          value: u.id,
          text: `Логин: ${u.login}, Имя: ${u.first_name}`,
        });

        return acc;
      }, []) ?? []
    );
  }

  private _addUserEvents() {
    const { addUser, chatId } = this.props;

    let users: IUser[] = [];
    let selectedUser: IUser | undefined = undefined;

    addUser.select.props.searchInput?.setProps({
      events: {
        input: async (e) => {
          const value = (e.target as HTMLInputElement)?.value;
          users = (await ChatController.searchUser(value)) || [];
          if (!users?.length) return;

          const options = this._getOptions(users);
          addUser.select.props.pureSelect?.setProps({ options });
        },
      },
    });

    addUser.select?.setProps({
      events: {
        change: async (e) => {
          const value = (e.target as HTMLSelectElement)?.value;
          selectedUser = users.find((u) => String(u.id) === value);
        },
      },
    });

    addUser.apply.setProps({
      events: {
        click: async () => {
          if (!chatId || !selectedUser) return;
          await ChatController.addUsersToChat({ chatId, users: [selectedUser.id] });
          this.setProps({ show: undefined });
        },
      },
    });
  }

  private _deleteUserEvents() {
    const { deleteUser, chatId } = this.props;
    deleteUser.select.setProps({
      events: {
        change: async (e) => {
          const value = (e.target as HTMLSelectElement)?.value;
          console.error({ value, chatId });
          // TODO: доделать удаление!
          // selectedUser = users.find((u) => String(u.id) === value);
        },
      },
    });
  }

  afterRender() {
    const { cancel, events, deleteUser } = this.props;

    this._addUserEvents();
    this._deleteUserEvents();

    cancel.setProps({
      events: {
        click: () => {
          this.setProps({ show: false });
          deleteUser.select.props.pureSelect?.setProps({ hasValue: false });
        },
      },
    });

    deleteUser.select.props.pureSelect?.setProps({
      options: this._getOptions.apply(this),
    });

    if (!!events) return;
    this.setProps({
      events: {
        click: () => {
          this.setProps({ show: true });
        },
      },
    });
  }
}
