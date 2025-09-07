import { EventBus } from '@common';
import { merge, set } from '@utils';
import type { AnyObject } from '@utils';

export enum StoreEvents {
  Updated = 'updated',
}

export abstract class EventStore<TState = null> extends EventBus {
  protected store: TState | null = null;

  private _emitUpdate = () => this.emit(StoreEvents.Updated);

  get state(): TState {
    return this.store ?? ({} as TState);
  }

  set(path: string, value: unknown): void {
    const next = set(this.state as AnyObject, path, value);
    this.store = next as unknown as TState;
    this._emitUpdate();
  }

  merge(patch: Partial<TState> | TState): void {
    const next = merge(this.state as AnyObject, patch as AnyObject);
    this.store = next as unknown as TState;
    this._emitUpdate();
  }
}
