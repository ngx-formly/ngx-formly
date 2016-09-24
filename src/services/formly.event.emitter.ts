import {Subject} from "rxjs/Subject";

export class FormlyValueChangeEvent {
  constructor(public key: string, public value: any) {}
}

export class FormlyEventEmitter extends Subject<String> {
  emit(value) {
    super.next(value);
  }
}

export class FormlyPubSub {
  Stream = new FormlyEventEmitter();
  emitters = {};
  updated = false;

  getUpdated() {
    return this.updated;
  }

  setUpdated(value) {
    this.updated = value;
  }

  setEmitter(key, emitter) {
    this.emitters[key] = emitter;
  }

  getEmitter(key) {
    return this.emitters[key];
  }
}
