import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, APP_INITIALIZER, NgModule } from '@angular/core';
import { FormlyModule, FormlyFormBuilder, FormlyFieldConfig, ConfigOption } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

function setInputs<T>(fixture: ComponentFixture<T>, inputs: T, detectChanges = true) {
  (Object.keys(inputs) as (keyof T)[]).forEach((input) => {
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
interface IFormlyDebugElement<E> extends DebugElement {
  readonly nativeElement: E;
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
    teardown: { destroyAfterEach: false },
  }).overrideComponent(TestComponent, {
    set: {
      template,
      inputs: Object.keys(inputs),
    },
  });

  const fixture = TestBed.createComponent(TestComponent) as ComponentFixture<T>;
  (Object.keys(inputs) as (keyof T)[]).forEach((input) => {
    fixture.componentInstance[input] = inputs[input];
  });

  setInputs(fixture, inputs, detectChanges);

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
    setInputs: (props) => setInputs(fixture, props),
    query: (selector: string) => fixture.debugElement.query(By.css(selector)),
    queryAll: (selector: string) => fixture.debugElement.queryAll(By.css(selector)),
  } as FixtureUtils;

  (Object.keys(inputs) as (keyof T)[]).forEach((input) => {
    Object.defineProperty(utils, input, {
      get: () => fixture.componentInstance[input],
    });
  });

  return utils;
}

export function createFieldComponent(
  field: FormlyFieldConfig,
  config: IComponentOptions<{ field: FormlyFieldConfig }> = {},
) {
  const model = field?.model || {};
  const options = field?.options || {};
  delete (field as any)?.model;
  delete (field as any)?.options;

  const utils = createComponent<{ field: FormlyFieldConfig }>({
    template: '<formly-field [field]="field"></formly-field>',
    inputs: { field },
    ...config,
    providers: [
      ...(config.providers || []),
      {
        provide: APP_INITIALIZER,
        useFactory: (builder: FormlyFormBuilder) => () => {
          builder.build({
            model,
            options,
            fieldGroup: [field],
          });

          return of(null);
        },
        deps: [FormlyFormBuilder],
        multi: true,
      },
    ],
  });

  const setInputs = utils.setInputs;
  utils.setInputs = (props) => {
    if (props.field) {
      const builder = utils.fixture.componentRef.injector.get(FormlyFormBuilder);
      builder.build(props.field);
    }

    setInputs(props);
  };

  return utils;
}

@Component({
  selector: 'formly-test-component',
  template: '',
})
class TestComponent {}
