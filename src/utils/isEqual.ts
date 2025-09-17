import { isArray } from './isArray';
import { isPlainObject } from './isPlainObject';
import type { PlainObject } from './types';

export function isEqualObject(lhs: PlainObject, rhs: PlainObject): boolean {
  const keysA = Object.keys(lhs);
  const keysB = Object.keys(rhs);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!(key in rhs)) return false;
    const a = lhs[key];
    const b = rhs[key];

    if (isPlainObject(a) && isPlainObject(b)) {
      if (!isEqualObject(a, b)) return false;
      continue;
    }
    if (isArray(a) && isArray(b)) {
      if (!isEqualArray(a, b)) return false;
      continue;
    }

    if (!Object.is(a, b)) return false;
  }
  return true;
}

export function isEqualArray(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const va = a[i];
    const vb = b[i];

    if (isPlainObject(va) && isPlainObject(vb)) {
      if (!isEqualObject(va, vb)) return false;
      continue;
    }
    if (isArray(va) && isArray(vb)) {
      if (!isEqualArray(va, vb)) return false;
      continue;
    }

    if (!Object.is(va, vb)) return false;
  }
  return true;
}

/** Проверка рекурсивно на равенство массивов и объектов */
export const isEqual = <T>(left: T, right: T) => {
  // Сравнен
  if (!left || !right) return false;
  // ие количества ключей объектов и массивов
  if (Object.keys(left).length !== Object.keys(right).length) {
    return false;
  }

  for (const [key, value] of Object.entries(left)) {
    const rightValue = (right as PlainObject)[key];
    if (isPlainObject(value) && isPlainObject(rightValue)) {
      if (isEqualObject(value, rightValue)) continue;
      return false;
    }
    if (isArray(value) && isArray(rightValue)) {
      if (isEqualArray(value, rightValue)) continue;
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
};
