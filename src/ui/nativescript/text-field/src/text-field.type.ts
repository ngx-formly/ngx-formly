import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ns-input',
  template: `
    <TextField
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [autocorrect]="props.autocorrect"
      [secure]="props.secure"
      [hint]="props.hint"
      [keyboardType]="props.keyboardType"
    >
    </TextField>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldText extends FieldType<FieldTypeConfig> {}
