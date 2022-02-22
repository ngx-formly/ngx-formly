import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';

// Source copied from https://github.com/cnunciato/ng2-mock-component
export function mockComponent(options: Component): Component {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: options.inputs,
    outputs: options.outputs || [],
    exportAs: options.exportAs || '',
  };

  class Mock {}

  metadata.outputs.forEach((method) => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  return Component(metadata)(Mock as any);
}

export function createFieldChangesSpy(field: FormlyFieldConfig): [jest.Mock, Subscription] {
  const spy = jest.fn();

  return [spy, field.options.fieldChanges.subscribe(spy)];
}

class TargetEvent extends Event {
  get target() {
    return this._target;
  }
  set target(_target) {
    this._target = _target;
  }
  private _target: any;

  constructor(type: string, target: any) {
    super(type);
    this.target = target;
  }
}

export function ɵCustomEvent(target?: any) {
  return new TargetEvent('custom', target);
}
