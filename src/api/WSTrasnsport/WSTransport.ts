import { EventBus } from '@common';
import type { AnyObject } from '@utils';

import { BASE_URL_WS } from '../constants';

type Message<T> = { type: string } & { [K in keyof T]: T[K] };

export type BaseWsMessage<T extends AnyObject = AnyObject> = Message<T>;

export const enum WSTransportEvents {
  Connected = 'Connected',
  Close = 'Close',
  Error = 'Error',
  Message = 'Message',
}

type WSMessages<T extends BaseWsMessage = BaseWsMessage> = {
  [WSTransportEvents.Connected]: [void];
  [WSTransportEvents.Close]: [void];
  [WSTransportEvents.Error]: [Event];
  [WSTransportEvents.Message]: [T | T[]];
};

export class WSTransport<T extends BaseWsMessage = BaseWsMessage> extends EventBus<WSMessages<T>> {
  private socket?: WebSocket;

  private pingInterval?: ReturnType<typeof setInterval>;

  private readonly pingIntervalTime = 30_000; // 30s между пингами

  private readonly url: string = '';

  constructor() {
    super();
    this.url = BASE_URL_WS;
  }

  send(data: string | number | BaseWsMessage | ArrayBuffer | Blob): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket is not connected');
    }

    if (typeof data === 'string' || data instanceof ArrayBuffer || data instanceof Blob) {
      this.socket.send(data);
    } else if (typeof data === 'number') {
      this.socket.send(String(data));
    } else {
      this.socket.send(JSON.stringify(data));
    }
  }

  connect(url: string): Promise<void> {
    // TODO: При обновлении страницы надо переподключить заново к чату
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      throw new Error('The socket is already connected');
    }

    this.socket = new WebSocket(`${this.url}/${url}`);

    this.subscribe(this.socket);
    this.setupPing();

    return new Promise<void>((resolve, reject) => {
      const onErr = (e: Event) => reject(e);
      const onOk = () => {
        this.off(WSTransportEvents.Error, onErr);
        resolve();
      };

      this.once(WSTransportEvents.Connected, onOk);
      this.once(WSTransportEvents.Error, onErr);
    });
  }

  close(): void {
    this.socket?.close();
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }

  setupPing(): void {
    this.pingInterval = setInterval(() => {
      try {
        this.send({ type: 'ping' });
      } catch {
        // игнор — если сокет успели закрыть между тиками
      }
    }, this.pingIntervalTime);

    // При закрытии — чистим интервал
    this.on(WSTransportEvents.Close, () => {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = undefined;
      }
    });
  }

  subscribe(socket: WebSocket): void {
    socket.addEventListener('open', () => {
      this.emit(WSTransportEvents.Connected);
    });

    socket.addEventListener('close', () => {
      this.emit(WSTransportEvents.Close);
    });

    socket.addEventListener('error', (e: Event) => {
      this.emit(WSTransportEvents.Error, e);
    });

    socket.addEventListener('message', (message: MessageEvent<unknown>) => {
      const raw = message.data;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;

      const isIgnorable = (t?: string) => t === 'pong' || t === 'user connected' || t === 'Wrong message type';

      if (Array.isArray(parsed)) {
        // один emit на все сообщения, если это массив
        const payload = parsed.filter((item) => !isIgnorable(item?.type));

        if (payload.length > 0) this.emit(WSTransportEvents.Message, payload);
        return;
      }

      // одиночное сообщение
      const data = parsed as T;
      const t = (data as AnyObject)?.type as string | undefined;
      if (!isIgnorable(t)) this.emit(WSTransportEvents.Message, data);
    });
  }
}
