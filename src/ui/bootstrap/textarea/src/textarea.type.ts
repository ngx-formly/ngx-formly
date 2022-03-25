import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-textarea',
  template: `
    <textarea
      [formControl]="formControl"
      [cols]="props.cols"
      [rows]="props.rows"
      class="form-control"
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
    >
    </textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      cols: 1,
      rows: 1,
    },
  };
}
