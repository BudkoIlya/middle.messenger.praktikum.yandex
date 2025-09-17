import { HttpError } from '@api/HTTPTransport/HTTPTransport';
import { Router } from '@common/Router';
import { LinksPages } from '@common/Router/PathConfig';

export async function withTryCatch<T>(
  fn: () => Promise<T>,
  onErrorResponse?: (v?: unknown) => void,
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    if (e instanceof HttpError) {
      onErrorResponse?.(e);
      new Router().push(`${LinksPages.error}/${e.status}`);
      console.error(e.message);
    } else {
      console.error(e);
    }
  }
}
