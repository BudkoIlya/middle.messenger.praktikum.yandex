import { isObject, typedObjectEntries, withLoader } from '@utils';

import { BASE_URL } from '../constants';
import { DEFAULT_HEADER } from './constants';
import { Method } from './types';
import type { BadRequest, FetchWithRetryOptions, FullRequestOptions, RequestOptions } from './types';

export class HttpError<TBody = unknown> extends Error {
  readonly status: number;

  readonly statusText: string;

  readonly headers: Record<string, string>;

  readonly body?: TBody | string;

  readonly reason?: string;

  constructor(params: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body?: TBody | string;
    reason?: string;
    message?: string;
  }) {
    const base = params.message ?? params.reason ?? `HTTP Error ${params.status}: ${params.statusText}`;
    super(base);
    this.name = 'HttpError';
    this.status = params.status;
    this.statusText = params.statusText;
    this.headers = params.headers;
    this.body = params.body;
    this.reason = params.reason;
  }
}

const queryStringify = (data: Record<string, unknown>): string => {
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const formattedValue = typeof value === 'string' ? value : String(value);
    return `${result}${key}=${encodeURIComponent(formattedValue)}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
};

const parseAllHeaders = (raw: string): Record<string, string> => {
  const out: Record<string, string> = {};
  raw.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':');
    if (idx > -1) {
      const k = line.slice(0, idx).trim().toLowerCase();
      const v = line.slice(idx + 1).trim();
      if (k) out[k] = v;
    }
  });
  return out;
};

const tryParseJson = <T = unknown>(text: string): { ok: true; data: T } | { ok: false } => {
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false };
  }
};

export abstract class HTTPTransport {
  private async request<TResp = unknown, TBody = unknown>(
    url: string,
    options: FullRequestOptions<TBody>,
  ): Promise<TResp> {
    const { method, data, headers = { ...DEFAULT_HEADER, ...options.headers }, timeout = 3000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === Method.GET;

      const urlWithQuery = isGet && isObject(data) ? `${url}${queryStringify(data as Record<string, unknown>)}` : url;

      xhr.open(method, urlWithQuery);

      const willSendFormData = data instanceof FormData;
      const headersToSend: Record<string, string> = { ...headers };

      if (willSendFormData) {
        for (const k of Object.keys(headersToSend)) {
          if (k.toLowerCase() === 'content-type') {
            delete headersToSend[k];
          }
        }
      }

      typedObjectEntries(headersToSend).forEach(([key, value]) => xhr.setRequestHeader(key, value));

      xhr.withCredentials = true;

      xhr.onload = () => {
        const status = xhr.status;
        const statusText = xhr.statusText || '';
        const rawHeaders = xhr.getAllResponseHeaders?.() ?? '';

        const headersMap = parseAllHeaders(rawHeaders);
        const contentType = xhr.getResponseHeader('Content-Type') || headersMap['content-type'] || '';
        const isJson = contentType.includes('application/json');
        const text = xhr.responseText ?? '';

        // Парсим json, если возможно
        const parsed = isJson ? tryParseJson<unknown>(text) : { ok: false as const };
        const body = parsed.ok ? parsed.data : isJson ? text : text;

        if (status >= 200 && status < 300) {
          resolve((parsed.ok ? parsed.data : text) as TResp);
          return;
        }

        const reason =
          parsed.ok && isObject(parsed.data) && 'reason' in (parsed.data as object)
            ? (parsed.data as BadRequest).reason
            : undefined;

        reject(
          new HttpError({
            status,
            statusText,
            headers: headersMap,
            body,
            reason,
            message: reason ?? `HTTP Error ${status}: ${statusText}`,
          }),
        );
      };

      xhr.onabort = () =>
        reject(new HttpError({ status: 0, statusText: 'aborted', headers: {}, message: 'Request aborted' }));
      xhr.onerror = () =>
        reject(new HttpError({ status: 0, statusText: 'network-error', headers: {}, message: 'Network error' }));
      xhr.ontimeout = () =>
        reject(new HttpError({ status: 0, statusText: 'timeout', headers: {}, message: 'Request timeout' }));
      xhr.timeout = timeout;

      if (isGet || data == null) {
        xhr.send();
      } else if (willSendFormData) {
        xhr.send(data as FormData);
      } else if (isObject(data) && !(data instanceof URLSearchParams)) {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data as XMLHttpRequestBodyInit);
      }
    });
  }

  fetch<TResp = unknown, TBody = unknown>(
    method = Method.GET,
    url: string,
    options: RequestOptions<TBody> = {},
  ): Promise<TResp> {
    const { showLoader = true, ...httpOptions } = options;
    const run = () => this.request<TResp, TBody>(`${BASE_URL}/${url}`, { ...httpOptions, method });
    return showLoader ? withLoader(run) : run();
  }

  private static isRetryableError(err: unknown): boolean {
    if (err instanceof HttpError) {
      if (err.status === 0) return true;
      if (err.status >= 400 && err.status <= 599) return true;
      return false;
    }
    return true; // неизвестные/нестандартные
  }

  fetchWithRetry<TResp = unknown, TBody = unknown>(
    url: string,
    options: FetchWithRetryOptions<TBody> = {},
  ): Promise<TResp> {
    const { method = Method.GET, retries = 2, retryDelay = 500, showLoader = true, ...httpOptions } = options;

    let attempts = 0;
    const executeRequest = async (): Promise<TResp> => {
      attempts++;
      try {
        return await this.fetch<TResp, TBody>(method, `${BASE_URL}/${url}`, { ...httpOptions, showLoader: false });
      } catch (error) {
        if (attempts <= retries && HTTPTransport.isRetryableError(error)) {
          await new Promise((r) => setTimeout(r, retryDelay));
          return executeRequest();
        }

        if (error instanceof HttpError) throw error;
        throw new Error(String(error));
      }
    };

    return showLoader ? withLoader(executeRequest) : executeRequest();
  }
}
