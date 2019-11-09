import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, APP_INITIALIZER, NgModule } from '@angular/core';
import { FormlyModule, FormlyFormBuilder, FormlyFieldConfig, ConfigOption } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

function setInputs<T>(fixture: ComponentFixture<T>, inputs: T, detectChanges = true) {
  Object.keys(inputs).forEach(input => {
    fixture.componentInstance[input] = inputs[input];
  });

  if (detectChanges !== false) {
    fixture.detectChanges();
  }
}

interface IComponentOptions<T> extends NgModule {
  template?: string;
  inputs?: T;
  config?: ConfigOption;
  detectChanges?: boolean;
}

export function createComponent<T>({
  template,
  inputs,
  config,
  detectChanges,
  imports,
  declarations,
  providers,
}: IComponentOptions<T>) {
  TestBed.configureTestingModule({
    declarations: [TestComponent, ...(declarations || [])],
    imports: [ReactiveFormsModule, FormlyModule.forRoot(config), ...(imports || [])],
    providers: providers || [],
  }).overrideComponent(TestComponent, { set: { template } });

  const fixture = TestBed.createComponent(TestComponent);
  Object.keys(inputs).forEach(input => {
    fixture.componentInstance[input] = inputs[input];
  });

  setInputs(fixture, inputs, detectChanges);

  interface IFormlyDebugElement<E> extends DebugElement {
    readonly nativeElement: E;
  }

  type FixtureUtils = T & {
    fixture: ComponentFixture<T>;
    detectChanges: typeof fixture['detectChanges'];
    setInputs: (inputs: Partial<T>) => void;
    query: <E extends Element = Element>(selector: string) => IFormlyDebugElement<E>;
    queryAll: <E extends Element = Element>(selector: string) => IFormlyDebugElement<E>[];
  };

  const utils = {
    fixture,
    detectChanges: () => fixture.detectChanges(),
    setInputs: props => setInputs(fixture, props),
    query: (selector: string) => fixture.debugElement.query(By.css(selector)),
    queryAll: (selector: string) => fixture.debugElement.queryAll(By.css(selector)),
  } as FixtureUtils;

  Object.keys(inputs).forEach(input => {
    Object.defineProperty(utils, input, {
      get: () => fixture.componentInstance[input],
    });
  });

  return utils;
}

export function createFormlyFieldComponent(
  field: FormlyFieldConfig,
  options: IComponentOptions<{ field: FormlyFieldConfig }> = {},
) {
  const model = field && field.model ? field.model : {};

  return createComponent<{ field: FormlyFieldConfig }>({
    template: '<formly-field [field]="field"></formly-field>',
    inputs: { field },
    ...options,
    providers: [
      ...(options.providers || []),
      {
        provide: APP_INITIALIZER,
        useFactory: (builder: FormlyFormBuilder) => () => {
          builder.buildField({
            model: model || {},
            fieldGroup: [field],
          });

          return of(null);
        },
        deps: [FormlyFormBuilder],
        multi: true,
      },
    ],
  });
}

@Component({
  selector: 'formly-test-component',
  template: '',
})
class TestComponent {}
