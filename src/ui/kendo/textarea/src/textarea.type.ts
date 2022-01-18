import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/kendo/form-field';

@Component({
  selector: 'formly-field-kendo-textarea',
  template: ` <textarea kendoTextArea [formControl]="formControl" [formlyAttributes]="field"></textarea> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldTextArea extends FieldType<FieldTypeConfig> {}
