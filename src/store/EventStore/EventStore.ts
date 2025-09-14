import { EventBus } from '@common';
import { merge, set } from '@utils';
import type { AnyObject } from '@utils';

export enum StoreEvents {
  Updated = 'Updated',
}

export abstract class EventStore<TState extends object = object> extends EventBus {
  protected _store: TState;

  protected constructor(initial: TState) {
    super();
    this._store = initial;
  }

  private _emitUpdate = () => this.emit(StoreEvents.Updated);

  get state(): TState {
    return this._store;
  }

  set(path: string, value: unknown) {
    this._store = set(this._store as AnyObject, path, value) as TState;
    this._emitUpdate();
  }

  merge(patch: Partial<TState>) {
    this._store = merge(this._store as AnyObject, patch as AnyObject) as TState;
    this._emitUpdate();
  }

  updateStore() {
    this._emitUpdate();
  }

  clear(storeName?: keyof TState & string): void {
    if (storeName) {
      this._store = set(this._store as AnyObject, storeName, null) as TState;
    } else {
      this._store = {} as TState;
    }
    this._emitUpdate();
  }
}
