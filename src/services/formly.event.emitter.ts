import {Subject} from 'rxjs/Subject';
import {FormlyFieldConfig} from './../components/formly.field.config';

export class FormlyValueChangeEvent {
  constructor(public field: FormlyFieldConfig, public value: any) {}
}

export class FormlyEventEmitter extends Subject<String> {
  emit(value) {
    super.next(value);
  }
}

export class FormlyPubSub {
  emitters = {};

  setEmitter(key, emitter) {
    this.emitters[key] = emitter;
  }

  getEmitter(key) {
    return this.emitters[key];
  }
}
