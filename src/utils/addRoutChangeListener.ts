interface IAddRoutChangeListener {
  element: HTMLElement;
  selector?: string;
  attribute?: string;
  remove?: boolean;
}

const listenerFn =
  (attribute = 'href', el: Element) =>
  (e: Event) => {
    e.preventDefault();

    const path = el.getAttribute(attribute) || '/';

    history.pushState({ page: path }, path, path);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { page: path } }));
  };

export const addRoutChangeListener = ({
  element,
  selector = 'a[href]',
  attribute = 'href',
  remove,
}: IAddRoutChangeListener) => {
  const el = element.querySelector(selector);
  if (!el) return;

  if (remove) {
    el.removeEventListener('click', listenerFn(attribute, el));
    return;
  }

  el.addEventListener('click', listenerFn(attribute, el));
};
