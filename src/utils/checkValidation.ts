import type { Input } from '../components';
import type { Button } from '../components/button';

type InputsName =
  | 'first_name'
  | 'second_name'
  | 'login'
  | 'display_name'
  | 'email'
  | 'password'
  | 'new_password'
  | 'old_password'
  | 'confirm_password'
  | 'phone'
  | 'message';

const patterns: Record<InputsName, RegExp> = {
  first_name: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/,
  second_name: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/,
  login: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
  display_name: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
  email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  new_password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  confirm_password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  old_password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  phone: /^\+?\d{10,15}$/,
  message: /.+/,
};

const isUpdatingOnFocus = new WeakMap<Input, boolean>();

const getInput = (element: HTMLElement, input: Input) =>
  element.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;

const validate = (name: InputsName, value: string): boolean => {
  const rule = patterns[name];
  return rule.test(value);
};

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const classFromProps = (input: Input) => norm(String(input.props.class ?? '').replace(/\berror\b/g, ''));

const buildClass = (base: string, withError: boolean) => norm([base, withError ? 'error' : ''].join(' '));

const validateInput = (input: Input, element: HTMLElement): boolean => {
  const inputEl = element.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;

  if (!inputEl) return true;
  const { name, value } = inputEl;

  const isValid = validate(name as InputsName, value.trim());
  const propsClass = classFromProps(input);
  const nextClass = buildClass(propsClass, !isValid);

  if (input.props.value !== value || norm(String(input.props.class ?? '')) !== nextClass) {
    input.setProps({ ...input.props, value, class: nextClass });
  }
  return isValid;
};

export const checkValidationByFields = (
  element: HTMLElement,
  inputs: Input[],
  button?: Button,
): (() => void) | void => {
  inputs.forEach((input) => {
    const prevEvents = input.props.events || {};

    const onMouseDown = (e: Event) => {
      const inputEl = getInput(element, input);
      if (!inputEl) return;

      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt === inputEl || inputEl.contains(tgt))) return;

      inputEl.focus();
    };

    const onFocusIn = () => {
      if (isUpdatingOnFocus.get(input)) return;

      const inputEl = getInput(element, input);
      if (!inputEl) return;

      const base = classFromProps(input);
      const current = (input.props.class as string | undefined)?.trim() || '';
      if (current === base) return; // не вызываем ререндер

      isUpdatingOnFocus.set(input, true);
      input.setProps({ ...input.props, class: base });

      // Рефокусим уже новый инпут после рендера
      requestAnimationFrame(() => {
        const nextEl = getInput(element, input);
        if (nextEl && document.activeElement !== nextEl) {
          nextEl.focus();
          const len = nextEl.value.length;
          nextEl.setSelectionRange(len, len);
        }
        isUpdatingOnFocus.set(input, false);
      });
    };

    const onFocusOut = () => {
      const inputEl = getInput(element, input);
      if (!inputEl) return;

      const { name, value } = inputEl;
      const isValid = validate(name as InputsName, value.trim());
      const base = classFromProps(input);
      const nextClass = isValid ? base : `${base} error`;

      const sameClass = ((input.props.class as string | undefined)?.trim() || '') === nextClass;
      const sameValue = input.props.value === value;
      if (sameClass && sameValue) return; // не вызываем ререндер

      input.setProps({ ...input.props, value, class: nextClass });
    };

    input.setProps({
      ...input.props,
      events: { ...prevEvents, mousedown: onMouseDown, focusin: onFocusIn, focusout: onFocusOut },
    });
  });

  if (button) {
    const handler = (e: Event) => {
      e.preventDefault();
      const results = inputs.map((input) => ({ input, isValid: validateInput(input, element) }));

      const values = results.reduce<Record<string, string>>((acc, { input }) => {
        const el = element.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;
        if (el) acc[el.name] = el.value;
        return acc;
      }, {});
      console.table({ values });

      if (results.some(({ isValid }) => !isValid)) return;
    };

    const prevEvents = button.props.events || {};
    button.setProps({ ...button.props, events: { ...prevEvents, click: handler } });
  }
};
