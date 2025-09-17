import type { Button, Input, Select } from '@components';

import { REG_EXP_BY_INPUT_NAME } from './constants';
import type { InputsName } from './constants';

type CustomValidate = (name: string, value: string) => boolean;

type FieldLike = Input | Select;

const isUpdatingOnFocus = new WeakMap<FieldLike, boolean>();

const getFieldEl = (root: HTMLElement, field: FieldLike) => {
  const name = field.props.name;
  const input = root.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
  if (input) return input;
  return root.querySelector(`select[name="${name}"]`) as HTMLSelectElement | null;
};

const validateByField = (name: string, value: string, opts?: { kind?: 'input' | 'select' }): boolean => {
  if (opts?.kind === 'select') {
    // Для select: просто проверяем, что есть выбранное значение (не пустая строка)
    return value.trim() !== '';
  }
  // Для input: валидируем по словарю (если правила нет — считаем валидным)
  const re = (REG_EXP_BY_INPUT_NAME as Record<string, RegExp>)[name as InputsName];
  return re ? re.test(value) : true;
};

const patchIfChanged = (field: FieldLike, patch: Partial<FieldLike['props']>) => {
  const nextValue = patch.value ?? field.props.value;
  const nextError = patch.error ?? field.props.error;
  const sameValue = nextValue === field.props.value;
  const sameError = nextError === field.props.error;
  if (sameValue && sameError) return;
  field.setProps({ ...field.props, ...patch });
};

const validateField = (field: FieldLike, root: HTMLElement, customValidate?: CustomValidate): boolean => {
  const el = getFieldEl(root, field);
  if (!el) return true;

  const isSelect = el instanceof HTMLSelectElement;
  const { name } = el;
  const value = isSelect || el instanceof HTMLInputElement ? el.value : '';

  const isValid = customValidate
    ? customValidate(name, value)
    : validateByField(name, value, { kind: isSelect ? 'select' : 'input' });

  patchIfChanged(field, { value, error: !isValid });
  return isValid;
};
type Params<T> = {
  root: HTMLElement;
  inputs?: Input[];
  selects?: Select[];
  button?: Button;
  onSubmit?(values: T): void;
  customValidate?: CustomValidate;
};

export const checkValidationByFields = <T = unknown>({
  root,
  inputs,
  selects,
  button,
  onSubmit,
  customValidate,
}: Params<T>): (() => void) | void => {
  const fields: FieldLike[] = [...(inputs ?? []), ...(selects ?? [])];

  // Если полей нет вовсе — делать нечего
  if (fields.length === 0 && !button) return;

  // Для каждого поля вешаем одинаковую логику
  fields.forEach((field) => {
    const prevEvents = field.props.events || {};

    // Клик по контейнеру/label — переносим фокус в реальный элемент поля
    const onMouseDown = (e: Event) => {
      const el = getFieldEl(root, field);
      if (!el) return;

      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt === el || el.contains(tgt))) return; // прямой клик в контрол

      e.preventDefault();
      el.focus();
    };

    // Сброс ошибки на фокус
    const onFocusIn = () => {
      if (isUpdatingOnFocus.get(field)) return;
      const el = getFieldEl(root, field);
      if (!el) return;

      if (field.props.error !== true) return;

      isUpdatingOnFocus.set(field, true);
      patchIfChanged(field, { error: false });

      requestAnimationFrame(() => {
        const nextEl = getFieldEl(root, field);
        if (nextEl && document.activeElement !== nextEl) nextEl.focus();
        isUpdatingOnFocus.set(field, false);
      });
    };

    // Валидация на blur
    const onFocusOut = (e: Event) => {
      if (isUpdatingOnFocus.get(field)) return;
      const el = getFieldEl(root, field);
      if (!el) return;

      // Если уходим на элемент внутри того же поля — пропускаем
      const rel = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (rel && (rel === el || el.contains(rel))) return;

      validateField(field, root, customValidate);
    };

    field.setProps({
      ...field.props,
      events: { ...prevEvents, mousedown: onMouseDown, focusin: onFocusIn, focusout: onFocusOut },
    });
  });

  if (button) {
    const prev = button.props.events || {};
    const onSubmitClick = (e: Event) => {
      e.preventDefault();

      // Валидируем все имеющиеся поля
      const results = fields.map((fld) => ({
        field: fld,
        isValid: validateField(fld, root, customValidate),
      }));

      // Собираем значения из инпутов и селектов
      const values = results.reduce<Record<string, string>>((acc, { field }) => {
        const el = getFieldEl(root, field);
        if (!el) {
          return acc;
        }
        const name = (el as HTMLInputElement | HTMLSelectElement).name;
        const value = (el as HTMLInputElement | HTMLSelectElement).value;
        if (name) acc[name] = value;
        return acc;
      }, {}) as T;

      if (results.some(({ isValid }) => !isValid)) return;

      onSubmit?.(values);
    };

    button.setProps({ ...button.props, events: { ...prev, click: onSubmitClick } });
  }
};
