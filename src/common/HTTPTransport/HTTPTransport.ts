import { type FetchWithRetryOptions, type FullRequestOptions, Method, type RequestOptions } from './types';
import { DEFAULT_HEADER } from './constants';
import { typedObjectEntries } from '../../utils';

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const formattedValue = typeof value === 'string' ? value : String(value);
    return `${result}${key}=${encodeURIComponent(formattedValue)}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

class HTTPTransport {
  private async request<T = unknown>(url: string, options: FullRequestOptions): Promise<T> {
    const { method, data, headers = DEFAULT_HEADER, timeout = 3000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === Method.GET;

      const urlWithQuery =
        isGet && data && !(data instanceof FormData) ? `${url}${queryStringify(data as Record<string, unknown>)}` : url;

      xhr.open(method, urlWithQuery);

      typedObjectEntries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const contentType = xhr.getResponseHeader('Content-Type');
            const response = contentType?.includes('application/json')
              ? JSON.parse(xhr.responseText)
              : xhr.responseText;
            resolve(response as T);
          } catch (e) {
            reject(new Error('Error parsing response'));
          }
        } else {
          reject(new Error(`HTTP Error ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));
      xhr.timeout = timeout;

      if (isGet || !data) {
        xhr.send();
      } else {
        const body = typeof data === 'object' && !(data instanceof FormData) ? JSON.stringify(data) : data;
        xhr.send(body);
      }
    });
  }

  // Не стал добавлять отдельно каждый метод, сделал универсальный с аргументов method
  fetch<T = unknown>(method = Method.GET, url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method });
  }

  fetchWithRetry<T = unknown>(url: string, options: FetchWithRetryOptions = {}): Promise<T> {
    const { method = Method.GET, retries = 2, retryDelay = 500, ...httpOptions } = options;

    let attempts = 0;

    const executeRequest = async (): Promise<T> => {
      attempts++;
      try {
        return await this.fetch<T>(method, url, httpOptions);
      } catch (error) {
        if (attempts <= retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return executeRequest();
        }
        throw new Error(
          `Превышено максимальное количество попыток (${retries}). Последняя ошибка: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    return executeRequest();
  }
}

export const httpTransport = new HTTPTransport();
