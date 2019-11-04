import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormlyModule, FormlyFormBuilder, FormlyFieldConfig } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

export function createComponent<T>({ template, inputs, config, detectChanges, imports, declarations, preCreate }: any) {
  TestBed.configureTestingModule({
    declarations: [TestComponent, ...(declarations || [])],
    imports: [ReactiveFormsModule, FormlyModule.forRoot(config), ...(imports || [])],
  }).overrideComponent(TestComponent, { set: { template } });
  preCreate && preCreate();
  const fixture = TestBed.createComponent(TestComponent);
  Object.keys(inputs).forEach(input => {
    fixture.componentInstance[input] = inputs[input];
  });

  if (detectChanges !== false) {
    fixture.detectChanges();
  }

  return fixture as ComponentFixture<T>;
}

export function createFormlyFieldComponent(field: FormlyFieldConfig, options?: any) {
  const model = field && field.model ? field.model : {};

  return createComponent<{ field: FormlyFieldConfig }>({
    template: '<formly-field [field]="field"></formly-field>',
    inputs: { field },
    preCreate: () => {
      TestBed.get(FormlyFormBuilder).buildField({
        model: model,
        fieldGroup: [field],
      });
    },
    ...(options || {}),
  });
}

@Component({
  selector: 'formly-test-component',
  template: '',
})
class TestComponent {}
