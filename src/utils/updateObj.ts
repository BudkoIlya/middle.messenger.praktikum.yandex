import type { AnyObject, Indexed } from './types';

export const isObject = (item: unknown): item is Indexed =>
  typeof item === 'object' && item !== null && !Array.isArray(item);

/** Example: merge({ a: { b: { a: 2 } }, d: 5 }, { a: { b: { c: 1 }, d: 5 }, m: 6 })
 * Output: { a: { b: { a: 2, c: 1 }, d: 5 }, d: 5, m: 6 } */
export const merge = <T extends AnyObject | null = AnyObject>(
  lhs: T | null | undefined,
  rhs: T | null | undefined,
): T => {
  if (!lhs) return (rhs ?? {}) as T;
  if (!rhs) return lhs;

  const result = { ...lhs };
  Object.keys(rhs).forEach((key) => {
    const lhsValue = result[key];
    const rhsValue = rhs[key];
    if (isObject(lhsValue) && isObject(rhsValue)) {
      result[key] = merge(lhsValue, rhsValue);
    } else {
      result[key] = rhsValue;
    }
  });
  return result;
};

export const set = <T extends AnyObject | null>(object: T | unknown, path: string, value: unknown): T => {
  if (typeof object !== 'object' || object === null) return object as T;
  const keys = path.split('.');
  const lastItemKey = keys[keys.length - 1];
  const objByPath = keys.reduceRight<Indexed>((acc, key) => {
    if (key === lastItemKey) return { [key]: value };
    return { [key]: acc };
  }, {});
  return merge<T>(object as T, objByPath as T);
};
