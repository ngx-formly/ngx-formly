import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ns-input',
  template: `
    <TextField
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [autocorrect]="to.autocorrect"
      [secure]="to.secure"
      [hint]="to.hint"
      [keyboardType]="to.keyboardType"
    >
    </TextField>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldText extends FieldType {}
