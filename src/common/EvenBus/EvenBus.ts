export type Handler<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;

export class EventBus<TEvents extends Record<string, unknown[]> = Record<string, unknown[]>> {
  private listeners: { [K in keyof TEvents]?: Handler<TEvents[K]>[] } = {};

  on<K extends keyof TEvents>(event: K, callback: Handler<TEvents[K]>): void {
    const arr = (this.listeners[event] ??= []);
    arr.push(callback);
  }

  off<K extends keyof TEvents>(event: K, callback: Handler<TEvents[K]>): void {
    const arr = this.listeners[event];
    if (!arr) return;
    this.listeners[event] = arr.filter((cb) => cb !== callback);
  }

  once<K extends keyof TEvents>(event: K, callback: Handler<TEvents[K]>): void {
    const wrapper: Handler<TEvents[K]> = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    this.on(event, wrapper);
  }

  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {
    const arr = this.listeners[event];
    if (!arr) return;
    [...arr].forEach((cb) => cb(...args));
  }
}
