import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FieldType, FieldWrapper } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'formly-type-input',
  template: ` <input type="text" [formControl]="formControl" [formlyAttributes]="field" /> `,
})
export class FormlyFieldInput extends FieldType {}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <label [attr.for]="id">{{ to.label }}</label>
    <ng-template #fieldComponent></ng-template>
    <ng-container *ngIf="showError">
      <formly-validation-message [field]="field"></formly-validation-message>
    </ng-container>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper {}

@NgModule({
  declarations: [FormlyFieldInput, FormlyWrapperFormField],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormlyModule.forChild({
      types: [
        {
          name: 'input',
          component: FormlyFieldInput,
          wrappers: ['form-field'],
        },
      ],
      wrappers: [
        {
          name: 'form-field',
          component: FormlyWrapperFormField,
        },
      ],
    }),
  ],
})
export class FormlyInputModule {}
