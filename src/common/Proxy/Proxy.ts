import type { Props } from '../Block/types';

const checkPrivateProp = (prop: string) => {
  if (prop.startsWith('_')) throw new Error('Нет прав');
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
    set<K extends keyof Props>(target: Props, prop: K, value: Props[K]) {
      checkPrivateProp(prop as string);

      if (target[prop] !== value) {
        target[prop] = value;
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
