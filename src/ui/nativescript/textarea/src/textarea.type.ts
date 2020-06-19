import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ns-textarea',
  template: `
    <TextView
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [hint]="to.hint"
      [autocorrect]="to.autocorrect"
      [keyboardType]="to.keyboardType"
    >
    </TextView>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextarea extends FieldType {}
