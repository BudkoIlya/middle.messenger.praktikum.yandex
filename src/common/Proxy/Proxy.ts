import type { Props } from '../Block/types';

const checkPrivateProp = (prop: string | symbol) => {
  if (typeof prop === 'string' && prop.startsWith('_')) throw new Error('Нет доступа');
};

export function createProxy(props: Props, setIsUpdated: (value: boolean) => void): Props {
  return new Proxy(props, {
    get(target: Props, prop: string) {
      checkPrivateProp(prop);
      const value = target[prop as keyof Props];
      if (typeof value === 'function') {
        // Используем универсальный тип для функций
        const functionValue = value as (...args: unknown[]) => unknown;
        return functionValue.bind(target);
      }
      return value;
    },
    set(target: Props, prop: string | symbol, value: Props[keyof Props]) {
      checkPrivateProp(prop as string);
      const key = prop as keyof Props;
      if (target[key] !== value) {
        target[key] = value;
        setIsUpdated(true);
      }

      return true;
    },
    deleteProperty(target: Props, prop: string) {
      if (prop in target) {
        throw new Error('Нет доступа');
      }
      return true;
    },
  });
}
