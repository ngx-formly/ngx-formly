import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FieldType, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'formly-type-input',
  template: ` <input type="text" [formControl]="formControl" [formlyAttributes]="field" /> `,
  standalone: false,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-wrapper-form-field',
  template: `
    <label [attr.for]="id">{{ props.label }}</label>
    <ng-template #fieldComponent></ng-template>
    @if (showError) {
      <formly-validation-message [field]="field"></formly-validation-message>
    }
  `,
  standalone: false,
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
