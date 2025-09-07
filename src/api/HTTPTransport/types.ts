export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// Часто используемые + общий шаблон на всякий случай
export type ContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'application/octet-stream';

type StandardHttpHeaderName =
  | 'Accept'
  | 'Content-Type'
  | 'Authorization'
  | 'User-Agent'
  | 'Cache-Control'
  | 'Credential';

export type HttpHeaders = Record<string, string> &
  Partial<Record<StandardHttpHeaderName, string>> & {
    'content-type'?: ContentType;
  };

export interface RequestOptions<TBody = unknown> {
  data?: TBody;
  headers?: HttpHeaders;
  timeout?: number;
  showLoader?: boolean;
  credentials?: RequestCredentials;
  mode?: RequestMode;
}

export interface FullRequestOptions<TBody = unknown> extends RequestOptions<TBody> {
  method: Method;
}

export interface FetchWithRetryOptions<TBody = unknown> extends RequestOptions<TBody> {
  method?: Method;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface BadRequest {
  reason?: string;
}
