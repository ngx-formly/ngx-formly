import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, EventEmitter } from '@angular/core';
import { FormlyConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { defaultFormlyConfig } from './core.module';
import { CoreExtension } from './extensions/core/core';
import { FieldValidationExtension } from './extensions/field-validation/field-validation';
import { FieldFormExtension } from './extensions/field-form/field-form';
import { FieldExpressionExtension } from './extensions';

interface IBuilderOption {
  onInit?: (c: FormlyConfig) => void;
  extensions?: string[];
}

export function createBuilder({ extensions, onInit }: IBuilderOption = {}) {
  const config = new FormlyConfig();
  config.addConfig({
    types: [
      { name: 'formly-group', component: MockComponent({ selector: 'formly-group' }) },
      { name: 'formly-template', component: MockComponent({ selector: 'formly-template' }) },
    ],
    extensions: [
      { name: 'core', extension: new CoreExtension(config) },
      { name: 'validation', extension: new FieldValidationExtension(config) },
      { name: 'form', extension: new FieldFormExtension() },
      { name: 'expression', extension: new FieldExpressionExtension() },
    ].filter(({ name }) => !extensions || extensions.includes(name)),
  });
  onInit && onInit(config);

  return new FormlyFormBuilder(
    config,
    null,
    null,
    null,
  );
}

export function createGenericTestComponent<T>(html: string, type: new (...args: any[]) => T): ComponentFixture<T> {
  TestBed.overrideComponent(type, {set: {template: html}});
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

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
  const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}
