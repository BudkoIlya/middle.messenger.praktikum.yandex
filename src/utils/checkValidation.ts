import type { Button, Input } from '@components';

import { REG_EXP_BY_INPUT_NAME } from './constants';
import type { InputsName } from './constants';

type CustomValidate = (name: string, value: string) => boolean;

const isUpdatingOnFocus = new WeakMap<Input, boolean>();

const getInput = (root: HTMLElement, input: Input) =>
  root.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;

const validate = (name: InputsName, value: string): boolean => REG_EXP_BY_INPUT_NAME[name].test(value);

// Сравнение, чтобы не вызывать лишние рирендеры
const patchIfChanged = (input: Input, patch: Partial<Input['props']>) => {
  const nextValue = patch.value ?? input.props.value;
  const nextError = patch.error ?? input.props.error;
  const sameValue = nextValue === input.props.value;
  const sameError = nextError === input.props.error;
  if (sameValue && sameError) return;
  input.setProps({ ...input.props, ...patch });
};

const validateInput = (input: Input, root: HTMLElement, customValidate?: CustomValidate): boolean => {
  const el = getInput(root, input);
  if (!el) return true;

  const { value, name } = el;
  const isValid = customValidate ? customValidate(name, value) : validate(name as InputsName, el.value);

  // Обновляем только если что-то реально поменялось
  patchIfChanged(input, { value, error: !isValid });

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

    // Клик по контейнеру/label — переносим фокус в инпут вручную
    const onMouseDown = (e: Event) => {
      const el = getInput(root, input);
      if (!el) return;

      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt === el || el.contains(tgt))) return; // клик прямо в инпут

      e.preventDefault();

      el.focus();
    };

    // Сброс ошибки на фокус (только если была)
    const onFocusIn = () => {
      if (isUpdatingOnFocus.get(input)) return;
      const el = getInput(root, input);
      if (!el) return;

      if (input.props.error !== true) return; // ничего сбрасывать не нужно

      isUpdatingOnFocus.set(input, true);
      patchIfChanged(input, { error: false });

      // Вернуть фокус после того, как DOM перерисуется
      requestAnimationFrame(() => {
        const nextEl = getInput(root, input);
        if (nextEl && document.activeElement !== nextEl) {
          nextEl.focus();
        }
        isUpdatingOnFocus.set(input, false);
      });
    };

    // Валидация на blur
    const onFocusOut = (e: Event) => {
      if (isUpdatingOnFocus.get(input)) return;

      const el = getInput(root, input);
      if (!el) return;

      // Если уходим на элемент внутри того же поля — пропускаем
      const rel = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (rel && (rel === el || el.contains(rel))) return;

      validateInput(input, root, customValidate);
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

      const results = inputs.map((inp) => ({
        input: inp,
        isValid: validateInput(inp, root, customValidate),
      }));

      const values = results.reduce<Record<string, string>>((acc, { input }) => {
        const el = root.querySelector(`input[name="${input.props.name}"]`) as HTMLInputElement | null;
        if (el) acc[el.name] = el.value;
        return acc;
      }, {}) as T;

      const hasError = results.some(({ isValid }) => !isValid);

      if (hasError) return;

      onSubmit?.(values);
    };

    button.setProps({ ...button.props, events: { ...prev, click: onSubmitClick } });
  }
};
