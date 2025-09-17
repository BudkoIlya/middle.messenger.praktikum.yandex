type Listener = (visible: boolean) => void;

class LoadingService {
  private count = 0;

  private listeners = new Set<Listener>();

  get visible() {
    return this.count > 0;
  }

  push() {
    this.count++;
    this.emit();
  }

  pop() {
    this.count = Math.max(0, this.count - 1);
    this.emit();
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.visible);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    const v = this.visible;
    this.listeners.forEach((fn) => fn(v));
  }
}

export const loading = new LoadingService();
