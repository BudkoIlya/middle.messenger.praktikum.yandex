export const addRoutChangeListener = ({
  element,
  selector = 'a[href]',
  attribute = 'href',
}: {
  element: HTMLElement;
  selector?: string;
  attribute?: string;
}) => {
  const el = element.querySelector(selector);

  if (el) {
    el.addEventListener('click', (e) => {
      e.preventDefault();

      const path = el.getAttribute(attribute) || '/';

      history.pushState({ page: path }, path, path);
      window.dispatchEvent(new PopStateEvent('popstate', { state: { page: path } }));
    });
  }
};
