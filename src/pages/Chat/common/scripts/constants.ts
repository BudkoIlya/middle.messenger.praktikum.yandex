// import type { IButton } from '../../../../components';
import type { IChatItems } from '../templates/chatItems';
import { Links, Paths } from '../../../../components/header/scripts/contants';
//
// export interface IContext extends IChatItems {
//   // button: Omit<IButton, 'text'>;
// }

export const getContext = (active = false): IChatItems => ({
  chatItems: [
    { userName: 'Роман', lastMessage: 'Привет', time: '12:00', unreadCount: '1' },
    { userName: 'Алиса', lastMessage: 'Привет', time: '12:00', unreadCount: '1' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Роман', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00', class: active ? 'chat__item--active' : '' },
    { userName: 'Артём', lastMessage: 'Привет', time: '12:00' },
    { userName: 'Артём', lastMessage: 'Привет', time: 'Пт' },
    { userName: 'Артём', lastMessage: 'Привет', time: '1 июля' },
  ],
  // button: {
  //   className: 'add_btn',
  // },
  id: Links.profile,
  path: Paths.profile.view.path,
});
