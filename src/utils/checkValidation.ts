import type { Input } from '../components';
import type { Button } from '../components/button';

type InputsName = 'first_name' | 'second_name' | 'login' | 'email' | 'password' | 'phone' | 'message';

const patterns: Record<InputsName, RegExp> = {
  first_name: /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/,
  second_name: /^[A-ZА-Я][A-Za-zА-Яа-я-]*$/,
  login: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,
  email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  phone: /^\+?\d{10,15}$/,
  message: /.+/,
};

const validate = (name: InputsName, value: string): boolean => {
  const rule = patterns[name];
  return rule.test(value);
};

const validateInput = (input: Input, element: HTMLElement): boolean => {
  const inputEl = element.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;

  if (!inputEl) return true;
  const { name, value } = inputEl;
  // Убираем class error на blur, чтобы он не множился на каждый blur
  const baseClass = inputEl.className.replace(/\berror\b/g, '').trim();
  const isValid = validate(name as InputsName, value.trim());
  input.setProps({ ...input.props, class: isValid ? baseClass : `${baseClass} error` });
  return isValid;
};

export const checkValidationByFields = (
  element: HTMLElement,
  inputs: Input[],
  button?: Button,
): (() => void) | void => {
  inputs.forEach((input) => {
    const inputEl = element.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;
    if (!inputEl) return;
    const blurHandler = () => validateInput(input, element);
    const focusHandler = () => {
      const baseClass = ((input.props.class as string) || '').replace(/\berror\b/g, '').trim();
      input.setProps({ ...input.props, class: baseClass });
    };

    const prevEvents = input.props.events || {};
    input.setProps({ ...input.props, events: { ...prevEvents, focusout: blurHandler, focusin: focusHandler } });
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
      console.table(values);
      if (results.some(({ isValid }) => !isValid)) {
        return;
      }
    };
    const prevEvents = button.props.events || {};
    button.setProps({ ...button.props, events: { ...prevEvents, click: handler } });
  }
};
