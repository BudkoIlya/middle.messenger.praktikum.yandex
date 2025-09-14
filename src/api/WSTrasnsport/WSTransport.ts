import { EventBus } from '@common';
import type { AnyObject } from '@utils';

import { BASE_URL_WS } from '../constants';

export type BaseWsMessage<T extends AnyObject | unknown = AnyObject> = { type?: string; [k: string]: T | unknown };

const enum WSTransportEvents {
  Connected = 'Connected',
  Close = 'Close',
  Error = 'Error',
  Message = 'Message',
}

type WSMessages<T extends BaseWsMessage = BaseWsMessage> = {
  [WSTransportEvents.Connected]: [void];
  [WSTransportEvents.Close]: [void];
  [WSTransportEvents.Error]: [Event];
  [WSTransportEvents.Message]: [T];
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

  public send(data: string | number | object | ArrayBuffer | Blob): void {
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

  public connect(url: string): Promise<void> {
    // TODO: При обновлении страницы надо переподключить заново к чату
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      throw new Error('The socket is already connected');
    }

    const path = this.url + url;
    this.socket = new WebSocket(path);

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

  public close(): void {
    this.socket?.close();
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }

  private setupPing(): void {
    // Отправляем пинг периодически
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

  private subscribe(socket: WebSocket): void {
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
      try {
        const raw = message.data;
        const parsed: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;

        const data = parsed as T;

        // Фильтр служебных сообщений (опционально)
        const type = (data as BaseWsMessage | undefined)?.type;
        if (type && (type === 'pong' || type === 'user connected')) return;

        this.emit(WSTransportEvents.Message, data);
      } catch {
        // Игнорируем ошибки парсинга JSON, как на скриншоте
      }
    });
  }
}
