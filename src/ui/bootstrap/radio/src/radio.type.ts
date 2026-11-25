import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { UntypedFormControl } from '@angular/forms';

interface RadioProps extends FormlyFieldProps {
  formCheck?: 'default' | 'inline';
}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-radio',
  template: `
    <ng-template #fieldTypeTemplate>
      @let options = props.options | formlySelectOptions: field | async;
      @for (choice of optionSources(options); track choice; let i = $index) {
        @let option = options[i];
        <div class="form-check" [class.form-check-inline]="props.formCheck === 'inline'">
          <input
            type="radio"
            [id]="id + '_' + i"
            class="form-check-input"
            [name]="field.name || id"
            [class.is-invalid]="showError"
            [attr.value]="option.value"
            [value]="option.value"
            [formControl]="option.disabled ? disabledControl : formControl"
            [formlyAttributes]="field"
            [attr.aria-describedby]="id + '-formly-validation-error'"
            [attr.aria-invalid]="showError"
          />
          <label class="form-check-label" [for]="id + '_' + i">
            {{ option.label }}
          </label>
        </div>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  protected readonly optionSources = FormlySelectOptionsPipe.ɵgetOptionSources;

  override defaultOptions = {
    props: {
      formCheck: 'default' as const,
    },
  };

  get disabledControl() {
    return new UntypedFormControl({ value: this.formControl.value, disabled: true });
  }
}
