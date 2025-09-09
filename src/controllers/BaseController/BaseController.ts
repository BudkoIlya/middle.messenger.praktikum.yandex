export abstract class BaseController<T> {
  onSubmit?(values: T): void;
}
