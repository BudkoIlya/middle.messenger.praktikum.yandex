import type { Props } from '../Block/types';

const checkPrivateProp = (prop: string) => {
  if (prop.startsWith('_')) throw new Error('Нет прав');
};

export function createProxy<T extends Record<string, unknown>>(
  props: Props<T>,
  setIsUpdated: (value: boolean) => void,
): Props<T> {
  return new Proxy(props, {
    get(target: Props<T>, prop: string) {
      checkPrivateProp(prop);
      const value = target[prop as keyof Props<T>];
      if (typeof value === 'function') {
        // Используем универсальный тип для функций
        const functionValue = value as (...args: unknown[]) => unknown;
        return functionValue.bind(target);
      }
    },
    set<K extends keyof Props<T>>(target: Props<T>, prop: K, value: Props<T>[K]) {
      checkPrivateProp(prop as string);

      if (target[prop] !== value) {
        target[prop] = value;
        setIsUpdated(true);
      }

      return true;
    },
    deleteProperty(target: Props<T>, prop: string) {
      if (prop in target) {
        throw new Error('Нет доступа');
      }
      return true;
    },
  });
}
