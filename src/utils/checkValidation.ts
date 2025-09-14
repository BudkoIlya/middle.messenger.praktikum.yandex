import type { Button, Input } from '@components';

import { REG_EXP_BY_INPUT_NAME } from './constants';
import type { InputsName } from './constants';

type CustomValidate = (name: string, value: string) => boolean;

const isUpdatingOnFocus = new WeakMap<Input, boolean>();

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const getInput = (root: HTMLElement, input: Input) =>
  root.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;

const classFromProps = (input: Input) => norm(String(input.props.class ?? '').replace(/\berror\b/g, ''));

const buildClass = (base: string, withError: boolean) => norm([base, withError ? 'error' : ''].join(' '));

const validate = (name: InputsName, value: string): boolean => REG_EXP_BY_INPUT_NAME[name].test(value);

const validateInput = (input: Input, root: HTMLElement, customValidate?: CustomValidate): boolean => {
  const el = getInput(root, input);
  if (!el) return true;

  const { name, value } = el;
  const isValid = customValidate ? customValidate(name, value) : validate(name as InputsName, value);
  const base = classFromProps(input);
  const nextClass = buildClass(base, !isValid);

  if (input.props.value !== value || norm(String(input.props.class ?? '')) !== nextClass) {
    input.setProps({ ...input.props, value, class: nextClass });
  }
  return isValid;
};

export const checkValidationByFields = <T = unknown>({
  root,
  inputs,
  button,
  onSubmit,
  customValidate,
}: {
  root: HTMLElement;
  inputs: Input[];
  button?: Button;
  onSubmit?(values: T): void;
  customValidate?: CustomValidate;
}): (() => void) | void => {
  inputs.forEach((input) => {
    const prevEvents = input.props.events || {};

    // Контролируем клик по label/контейнеру: предотвращаем нативный перевод фокуса, фокусим сами
    const onMouseDown = (e: Event) => {
      const el = getInput(root, input);
      if (!el) return;

      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt === el || el.contains(tgt))) return; // клик прямо в инпут

      e.preventDefault();

      el.focus();
    };

    const onFocusIn = () => {
      if (isUpdatingOnFocus.get(input)) return;

      const inputEl = getInput(root, input);
      if (!inputEl) return;

      const base = classFromProps(input);
      const current = (input.props.class as string | undefined)?.trim() || '';
      if (current === base) return; // не вызываем ререндер

      isUpdatingOnFocus.set(input, true);
      input.setProps({ ...input.props, class: base });

      // Вернуть фокус после того, как DOM перерисуется
      requestAnimationFrame(() => {
        const nextEl = getInput(root, input);
        if (nextEl && document.activeElement !== nextEl) {
          nextEl.focus();
          const len = nextEl.value.length;
          nextEl.setSelectionRange(len, len);
        }
        isUpdatingOnFocus.set(input, false);
      });
    };

    const onFocusOut = (e: Event) => {
      if (isUpdatingOnFocus.get(input)) return;

      const el = getInput(root, input);
      if (!el) return;

      // Если уходим на элемент внутри того же поля — пропускаем
      const rel = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (rel && (rel === el || el.contains(rel))) return;

      const { name, value } = el;
      const isValid = customValidate ? customValidate(name, value) : validate(name as InputsName, value.trim());
      const base = classFromProps(input);
      const nextClass = isValid ? base : `${base} error`;

      const sameClass = ((input.props.class as string | undefined)?.trim() || '') === nextClass;
      const sameValue = input.props.value === value;
      if (sameClass && sameValue) return;

      input.setProps({ ...input.props, value, class: nextClass });
    };

    input.setProps({
      ...input.props,
      events: { ...prevEvents, mousedown: onMouseDown, focusin: onFocusIn, focusout: onFocusOut },
    });
  });

  if (button) {
    const prev = button.props.events || {};
    const onSubmitClick = (e: Event) => {
      e.preventDefault();

      const results = inputs.map((inp) => ({ input: inp, isValid: validateInput(inp, root, customValidate) }));

      const values = results.reduce<Record<string, string>>((acc, { input }) => {
        const el = root.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;
        if (el) acc[el.name] = el.value;
        return acc;
      }, {});
      console.table({ values });

      const hasError = results.some(({ isValid }) => !isValid);

      if (hasError) return;

      onSubmit?.(values as T);
    };

    button.setProps({ ...button.props, events: { ...prev, click: onSubmitClick } });
  }
};
