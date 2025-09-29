import { beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_BASE_URL = 'https://api.example';

vi.mock('@api/constants', async () => {
  const actual = await vi.importActual<typeof import('@api/constants')>('@api/constants');
  /** Нельзя пробрасывать сюда переменную TEST_BASE_URL
   * There was an error when mocking a module. If you are using "vi.mock" factory, make sure there are no top level variables inside */
  return { ...actual, BASE_URL: 'https://api.example' };
});

vi.mock('@utils', async () => {
  const actual = await vi.importActual<typeof import('@utils')>('@utils');
  return {
    ...actual,
    withLoader: <T>(run: () => Promise<T>) => run(),
  };
});

// По документации импорты должны идти после моков
import { HttpError, HTTPTransport } from '../HTTPTransport';
import { Method } from '../types';

type Listener = () => void;
const emptyListener: Listener = () => {};

class MockXHR {
  static last?: MockXHR;

  method!: string;

  url!: string;

  withCredentials = true;

  status = 200;

  statusText = 'OK';

  responseText = '';

  timeout = 0;

  private headers: Record<string, string> = {};

  private requestHeaders: Record<string, string> = {};

  private _onload: Listener = emptyListener;

  private _onerror: Listener = emptyListener;

  private _onabort: Listener = emptyListener;

  private _ontimeout: Listener = emptyListener;

  constructor() {
    MockXHR.last = this;
  }

  /** open, setRequestHeader, send, getResponseHeader - обязательные методы для XHR */
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(k: string, v: string) {
    this.requestHeaders[k] = v;
  }

  send(_body?: unknown) {}

  getResponseHeader(name: string) {
    return this.headers[name.toLowerCase()] ?? null;
  }

  __setResponseHeaders(h: Record<string, string>) {
    this.headers = Object.fromEntries(Object.entries(h).map(([k, v]) => [k.toLowerCase(), v]));
  }

  __fireLoad() {
    this._onload?.();
  }

  __fireError() {
    this._onerror?.();
  }

  __fireAbort() {
    this._onabort?.();
  }

  __fireTimeout() {
    this._ontimeout?.();
  }

  /** сеттеры и геттеры необходимые для XHR */
  set onload(fn: Listener) {
    this._onload = fn;
  }

  get onload() {
    return this._onload;
  }

  set onerror(fn: Listener) {
    this._onerror = fn;
  }

  get onerror() {
    return this._onerror;
  }

  set onabort(fn: Listener) {
    this._onabort = fn;
  }

  get onabort() {
    return this._onabort!;
  }

  set ontimeout(fn: Listener) {
    this._ontimeout = fn;
  }

  get ontimeout() {
    return this._ontimeout;
  }
}

// Подменяем глобальный XHR перед каждым тестом
beforeEach(() => {
  vi.stubGlobal('XMLHttpRequest', MockXHR);
  MockXHR.last = undefined;
});

class T extends HTTPTransport {}

describe('HTTPTransport.fetch', () => {
  it('возвращает распаршенный JSON при 200 и application/json', async () => {
    const t = new T();

    const p = t.fetch<{ ok: true }>(Method.GET, 'users', { headers: { Test: '1' } });

    const xhr = MockXHR.last!;
    expect.soft(xhr.url).toBe(`${TEST_BASE_URL}/users`);

    xhr.status = 200;
    xhr.statusText = 'OK';
    xhr.responseText = JSON.stringify({ ok: true });
    xhr.__setResponseHeaders({ 'Content-Type': 'application/json' });
    xhr.__fireLoad();

    await expect(p).resolves.toEqual({ ok: true });
  });

  it('возвращает text при 200 и не-JSON контенте', async () => {
    const t = new T();
    const p = t.fetch<string>(Method.GET, 'plain');

    const xhr = MockXHR.last!;
    xhr.status = 200;
    xhr.responseText = 'hello';
    xhr.__setResponseHeaders({ 'Content-Type': 'text/plain' });
    xhr.__fireLoad();

    await expect(p).resolves.toBe('hello');
  });

  it('пробрасывает HttpError с reason из JSON при статусе 400+', async () => {
    const t = new T();
    const p = t.fetch(Method.GET, 'err');

    const xhr = MockXHR.last!;
    xhr.status = 400;
    xhr.statusText = 'Bad Request';
    xhr.responseText = JSON.stringify({ reason: 'Bad creds' });
    xhr.__setResponseHeaders({ 'Content-Type': 'application/json' });
    xhr.__fireLoad();

    await expect(p).rejects.toMatchObject({
      status: 400,
      statusText: 'Bad Request',
      reason: 'Bad creds',
      body: { reason: 'Bad creds' },
    });
  });

  it('GET добавляет query string из data (object)', async () => {
    const t = new T();
    const p = t.fetch(Method.GET, 'items', { data: { q: 'abc', page: 2 } });

    const xhr = MockXHR.last!;
    expect.soft(xhr.url).toBe(`${TEST_BASE_URL}/items?q=abc&page=2`);

    xhr.status = 200;
    xhr.responseText = JSON.stringify({ ok: true });
    xhr.__setResponseHeaders({ 'Content-Type': 'application/json' });
    xhr.__fireLoad();

    await expect(p).resolves.toEqual({ ok: true });
  });

  it('POST отправляет JSON, если data — объект (не FormData)', async () => {
    const t = new T();
    const p = t.fetch(Method.POST, 'create', {
      data: { name: 'John' },
      headers: { 'Content-Type': 'application/json' },
    });

    const xhr = MockXHR.last!;
    expect(xhr.method).toBe(Method.POST);

    xhr.status = 200;
    xhr.responseText = JSON.stringify({ id: 1 });
    xhr.__setResponseHeaders({ 'Content-Type': 'application/json' });
    xhr.__fireLoad();

    await expect(p).resolves.toEqual({ id: 1 });
  });

  it('FormData (даёт браузеру самому выставить Content-Type)', async () => {
    const t = new T();
    const fd = new FormData();
    fd.append('f', 'x');

    const p = t.fetch(Method.POST, 'upload', { data: fd });

    const xhr = MockXHR.last!;
    xhr.status = 200;
    xhr.responseText = JSON.stringify({ ok: true });
    xhr.__setResponseHeaders({ 'Content-Type': 'application/json' });
    xhr.__fireLoad();

    await expect(p).resolves.toEqual({ ok: true });
  });

  it('HttpError со status=0 и statusText="network-error"', async () => {
    const t = new T();
    const p = t.fetch(Method.GET, 'error');

    const xhr = MockXHR.last!;
    xhr.__fireError();

    await expect.soft(p).rejects.toBeInstanceOf(HttpError);
    await expect(p).rejects.toMatchObject({
      status: 0,
      statusText: 'network-error',
      message: 'Network error',
    });
  });

  it('HttpError со status=0 и statusText="timeout"', async () => {
    const t = new T();
    const p = t.fetch(Method.GET, 'slow', { timeout: 10 });

    const xhr = MockXHR.last!;
    xhr.__fireTimeout();

    await expect.soft(p).rejects.toBeInstanceOf(HttpError);
    await expect(p).rejects.toMatchObject({
      status: 0,
      statusText: 'timeout',
      message: 'Request timeout',
    });
  });

  it('HttpError со status=0 и statusText="aborted"', async () => {
    const t = new T();
    const p = t.fetch(Method.GET, 'abort');

    const xhr = MockXHR.last!;
    xhr.__fireAbort();

    await expect.soft(p).rejects.toBeInstanceOf(HttpError);
    await expect(p).rejects.toMatchObject({
      status: 0,
      statusText: 'aborted',
      message: 'Request aborted',
    });
  });
});
