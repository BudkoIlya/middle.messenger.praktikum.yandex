import { isPlainObject } from '@utils/isPlainObject';

import type { AnyObject, Indexed } from './types';

export const isObject = (item: unknown): item is Indexed =>
  typeof item === 'object' && item !== null && !Array.isArray(item);

/** Example: merge({ a: { b: { a: 2 } }, d: 5 }, { a: { b: { c: 1 }, d: 5 }, m: 6 })
 * Output: { a: { b: { a: 2, c: 1 }, d: 5 }, d: 5, m: 6 } */
export function merge<L extends AnyObject, R extends AnyObject | null | undefined = AnyObject>(
  left: L,
  right: R,
): { changed: boolean; merged: L } {
  if (!right) return { changed: false, merged: left };

  let changed = false;

  // Добавляем AnyObject, чтобы не ловить TS2862
  const target = left as AnyObject;
  const source = right as AnyObject;

  // Проходим только по собственным ключам rhs
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const targetVal = target[key];
    const sourceVal = source[key];

    if (isObject(targetVal) && isObject(sourceVal)) {
      const res = merge(targetVal as AnyObject, sourceVal as AnyObject);
      if (res.changed) changed = true;
    } else {
      if (targetVal !== sourceVal) {
        target[key] = sourceVal;
        changed = true;
      }
    }
  }

  return { changed, merged: left };
}

export const set = <T extends AnyObject = AnyObject>(object: T, path: string, value: unknown): T => {
  if (!isObject(object)) return object;

  const keys = path.split('.');
  let target: AnyObject = object;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!;
    const next = target[k];
    // создаём промежуточный объект, если его нет или он не объект
    target[k] = isObject(next) ? next : {};
    target = target[k] as AnyObject;
  }

  const lastKey = keys[keys.length - 1]!;
  // всегда перезаписываем
  target[lastKey] = value;

  return object;
};

const isCloneable = (x: unknown) =>
  isPlainObject(x) || Array.isArray(x) || x instanceof Date || x instanceof Map || x instanceof Set;

export const clonePlainDeep = <T>(v: T): T => {
  if (v === null || typeof v !== 'object') return v;

  if (v instanceof Date) return new Date(v.getTime()) as T;

  if (Array.isArray(v)) {
    const out = v.map(clonePlainDeep);
    return out as T;
  }

  if (v instanceof Map) {
    const m = new Map();
    for (const [k, val] of v.entries()) m.set(k, clonePlainDeep(val));
    return m as T;
  }

  if (v instanceof Set) {
    const s = new Set();
    for (const val of v.values()) s.add(clonePlainDeep(val));
    return s as T;
  }

  if (isPlainObject(v)) {
    const out: AnyObject = {};
    for (const k of Object.keys(v)) {
      const val = v[k];
      out[k] = isCloneable(val) ? clonePlainDeep(val) : val; // функции/классы — по ссылке
    }
    return out as T;
  }

  return v;
};
