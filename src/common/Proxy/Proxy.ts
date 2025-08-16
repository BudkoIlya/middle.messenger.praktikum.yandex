type Props = Record<string, unknown>;

const checkPrivateProp = (prop: string) => {
  if (prop.startsWith('_')) throw new Error('Нет прав');
};

export function createProxy(props: Props, setIsUpdated: (value: boolean) => void): Props {
  return new Proxy(props, {
    get(target: Props, prop: string) {
      checkPrivateProp(prop);
      const value = target[prop];
      return typeof value === 'function' ? value.bind(target) : value;
    },
    set(target: Props, prop: string, value: unknown) {
      checkPrivateProp(prop);

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
