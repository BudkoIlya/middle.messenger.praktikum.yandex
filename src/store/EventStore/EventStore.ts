import { EventBus } from '@common';
import { merge, set } from '@utils';
import type { AnyObject } from '@utils';

export enum StoreEvents {
  Updated = 'Updated',
}

export abstract class EventStore<TState = null> extends EventBus {
  protected _store: TState | null = null;

  private _emitUpdate = () => this.emit(StoreEvents.Updated);

  get state(): TState {
    return this._store ?? ({} as TState);
  }

  set(path: string, value: unknown): void {
    const next = set(this.state as AnyObject, path, value);
    this._store = next as TState;
    this._emitUpdate();
  }

  merge(patch: Partial<TState> | TState): void {
    const { merged } = merge(this.state as AnyObject, patch as AnyObject);
    this._store = merged as TState;
    this._emitUpdate();
  }

  clear(storeName?: string): void {
    if (this._store && storeName) {
      (this._store as AnyObject)[storeName] = null;
    } else {
      this._store = null;
    }
    this._emitUpdate();
  }
}
