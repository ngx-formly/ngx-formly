import { Component, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';

// Source copied from https://github.com/cnunciato/ng2-mock-component
export function MockComponent(options: Component): Component {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs || [],
    exportAs: options.exportAs || '',
  };

  class Mock {}

  metadata.outputs.forEach(method => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  return Component(metadata)(Mock as any);
}

/**
 * Create custom DOM event the old fashioned way
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Event/initEvent
 * Although officially deprecated, some browsers (phantom) don't accept the preferred "new Event(eventName)"
 */
export function newEvent(eventName: string, bubbles = false, cancelable = false) {
  const evt = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

export function createFieldChangesSpy(field: FormlyFieldConfig): [jasmine.Spy<jasmine.Func>, Subscription] {
  const spy = jasmine.createSpy('fieldChanges change spy');
  return [spy, field.options.fieldChanges.subscribe(spy)];
}
