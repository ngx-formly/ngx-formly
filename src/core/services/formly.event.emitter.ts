import { Subject } from 'rxjs/Subject';

export class FormlyValueChangeEvent {
  constructor(public key: string, public value: any) {}
}

export class FormlyEventEmitter extends Subject<FormlyValueChangeEvent> {
  emit(value: FormlyValueChangeEvent) {
    super.next(value);
  }
}

export class FormlyPubSub {
  emitters: { [name: string]: FormlyEventEmitter } = {};

  setEmitter(key: string, emitter: FormlyEventEmitter) {
    this.emitters[key] = emitter;
  }

  getEmitter(key: string) {
    return this.emitters[key];
  }

  removeEmitter(key: string) {
    delete this.emitters[key];
  }
}
