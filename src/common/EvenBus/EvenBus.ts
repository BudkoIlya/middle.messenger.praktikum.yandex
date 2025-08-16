type Handler<T extends unknown[] = unknown[]> = (...args: T) => void;

export class EventBus {
  private listeners: Record<string, Handler[]> = {};

  on<T extends unknown[] = unknown[]>(event: string, callback: Handler<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback as Handler);
  }

  off<T extends unknown[] = unknown[]>(event: string, callback: Handler<T>) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  emit<T extends unknown[] = unknown[]>(event: string, ...args: T) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
