import type { Props } from '../Block/types';

const checkPrivateProp = (prop: string) => {
  if (prop.startsWith('_')) throw new Error('Нет доступа');
};

export function createProxy<P extends Props>(props: P, setIsUpdated: (value: boolean) => void): P {
  return new Proxy(props, {
    get(target: P, prop: string) {
      checkPrivateProp(prop);
      const value = target[prop as keyof P];
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    },
    set(target: P, prop: string, value: P[keyof P]) {
      checkPrivateProp(prop as string);
      const key = prop as keyof P;
      if (target[key] !== value) {
        target[key] = value;
        setIsUpdated(true);
      }

      return true;
    },
    deleteProperty(target: P, prop: string) {
      if (prop in target) {
        throw new Error('Нет доступа');
      }
      return true;
    },
  });
}
