import { Router } from '@common/Router';
import type { Button, Link } from '@components';

interface IAddRoutChangeListener {
  element?: Link | Button;
  attribute?: string;
}

const listenerFn = (path: string) => (e: Event) => {
  e.preventDefault();

  new Router().push(path);
};

export const addRoutChangeListener = ({ element }: IAddRoutChangeListener) => {
  if (!element) return;

  const path = element.props.path as string;

  const prevEvents = element.props.events || {};

  element.setProps({ ...element.props, events: { ...prevEvents, click: listenerFn(path) } });
};
