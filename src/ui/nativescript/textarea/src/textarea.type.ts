import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ns-textarea',
  template: `
    <TextView
      class="input"
      [formlyAttributes]="field"
      [formControl]="formControl"
      [hint]="props.hint"
      [autocorrect]="props.autocorrect"
      [keyboardType]="props.keyboardType"
    >
    </TextView>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextarea extends FieldType<FieldTypeConfig> {}
