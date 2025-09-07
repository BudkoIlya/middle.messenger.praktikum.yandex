export abstract class BaseController<T> {
  abstract onSubmit?(values: T): void;
}
