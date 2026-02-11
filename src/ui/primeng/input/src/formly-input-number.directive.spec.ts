import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig, FormlyAttributes, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { InputNumber } from 'primeng/inputnumber';
import { FormlyInputNumberDirective } from './formly-input-number.directive';

describe('FormlyInputNumberDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputElement: HTMLInputElement;
  let formControl: FormControl<number | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormlyModule.forRoot(), TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputElement = fixture.nativeElement.querySelector('input');
    formControl = component.form.controls.number;
  });

  describe('should prevent marking control as dirty on blur without user input', () => {
    it('should NOT mark control as dirty when user focuses and blurs without typing', fakeAsync(() => {
      expect(formControl.pristine).toBe(true);
      expect(formControl.dirty).toBe(false);

      inputElement.dispatchEvent(new FocusEvent('focus'));
      tick();
      fixture.detectChanges();

      inputElement.dispatchEvent(new FocusEvent('blur'));
      tick();
      fixture.detectChanges();

      expect(formControl.dirty).toBe(false);
      expect(formControl.pristine).toBe(true);
    }));

    it('should mark control as touched but NOT dirty after blur without input', fakeAsync(() => {
      expect(formControl.touched).toBe(false);
      expect(formControl.dirty).toBe(false);

      inputElement.dispatchEvent(new FocusEvent('focus'));
      tick();
      inputElement.dispatchEvent(new FocusEvent('blur'));
      tick();
      fixture.detectChanges();

      expect(formControl.touched).toBe(true);
      expect(formControl.dirty).toBe(false);
    }));
  });

  describe('should mark control as dirty when user types', () => {
    it('should mark control as dirty after user input', fakeAsync(() => {
      const inputNumberCmp = fixture.debugElement.query(By.directive(InputNumber)).componentInstance as InputNumber;

      inputElement.dispatchEvent(new FocusEvent('focus'));
      tick();
      fixture.detectChanges();

      inputElement.value = '100';

      inputNumberCmp.onModelChange(100); // mark as dirty

      tick();
      fixture.detectChanges();

      expect(formControl.dirty).toBe(true);
    }));
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-input-number-custom',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyAttributes, InputNumber, FormlyInputNumberDirective],
  template: `
    <!-- prettier-ignore -->
    <p-inputnumber fluid
     [formControl]="formControl"
     [formlyAttributes]="field"
     [placeholder]="props.placeholder" />
  `,
})
class InputNumberCustomComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-host',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, InputNumberCustomComponent],
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model" />
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    number: new FormControl<number | null>(null),
  });

  model: { number?: number | null } = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'number',
      type: InputNumberCustomComponent,
      props: {
        label: 'Test Number',
        placeholder: 'Number input',
      },
    },
  ];
}
