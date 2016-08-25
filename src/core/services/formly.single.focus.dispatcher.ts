
import {Injectable} from "@angular/core";
export type SingleFocusDispatcherListener = (key: string) => void;

/**
 * Class to coordinate single focus based on key.
 * Intended to be consumed as an Angular service.
 * This service ensures that 'focus' is true for single field and, and also focus out on previous focused field.
 */
@Injectable()
export class SingleFocusDispatcher {
  private _listeners: SingleFocusDispatcherListener[] = [];

  /** Notify other items that focus for the given key has been set. */
  notify(key: string) {
    for (let listener of this._listeners) {
      listener(key);
    }
  }

  /** Listen for future changes to item selection. */
  listen(listener: SingleFocusDispatcherListener) {
    this._listeners.push(listener);
  }
}
