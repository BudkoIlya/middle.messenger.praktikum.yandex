export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

type StandardHttpHeaders = 'Accept' | 'Content-Type' | 'Authorization' | 'User-Agent' | 'Cache-Control';

export interface Header extends Record<string, string> {
  method: Method;
  'Content-Type': StandardHttpHeaders;
}

export interface RequestOptions {
  data?: Record<string, unknown> | XMLHttpRequestBodyInit;
  headers?: Header;
  timeout?: number;
}

export interface FullRequestOptions extends RequestOptions {
  method: Method;
}

export interface FetchWithRetryOptions extends RequestOptions {
  method?: Method;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}
