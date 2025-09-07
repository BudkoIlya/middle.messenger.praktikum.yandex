import { HttpError } from '@api/HTTPTransport/HTTPTransport';

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
      console.error(e.message);
    } else {
      console.error(e);
    }
  }
}
