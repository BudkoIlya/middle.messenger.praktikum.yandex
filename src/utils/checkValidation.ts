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

export const checkValidationByFields = (inputs: Input[], button?: Button): (() => void) | void => {
  const listeners: Array<{ element: HTMLElement; event: string; handler: EventListener }> = [];

  const validateInput = (input: Input): boolean => {
    const inputEl = input.element?.querySelector('input') as HTMLInputElement | null;
    if (!inputEl) return true;
    const { name, value } = inputEl;
    const baseClass = ((input.props.class as string) || '').replace(/\berror\b/g, '').trim();
    const isValid = validate(name as InputsName, value.trim());
    input.setProps({ class: isValid ? baseClass : `${baseClass} error` });
    return isValid;
  };

  inputs.forEach((input) => {
    const inputEl = input.element?.querySelector('input') as HTMLInputElement | null;
    if (!inputEl) return;
    const handler = () => validateInput(input);
    inputEl.addEventListener('blur', handler);
    listeners.push({ element: inputEl, event: 'blur', handler });
  });

  const buttonEl = button?.element as HTMLButtonElement | null;
  if (buttonEl) {
    const handler = (e: Event) => {
      e.preventDefault();
      const results = inputs.map((input) => ({ input, isValid: validateInput(input) }));
      const values = results.reduce<Record<string, string>>((acc, { input }) => {
        const el = input.element?.querySelector('input') as HTMLInputElement | null;
        if (el) acc[el.name] = el.value;
        return acc;
      }, {});
      console.table(values);
      if (results.some(({ isValid }) => !isValid)) {
        return;
      }
    };
    buttonEl.addEventListener('click', handler);
    listeners.push({ element: buttonEl, event: 'click', handler });
  }

  if (listeners.length) {
    return () => listeners.forEach(({ element, event, handler }) => element.removeEventListener(event, handler));
  }
};
