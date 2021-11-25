import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-textarea',
  template: `
    <textarea
      class="k-textarea"
      [class.k-state-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
    ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType {}
