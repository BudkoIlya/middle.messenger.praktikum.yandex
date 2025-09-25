export abstract class BaseController<T = null> {
  onSubmit?: (values: T) => void;
}
