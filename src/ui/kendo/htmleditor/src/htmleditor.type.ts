import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-htmleditor',
  template: `
    <kendo-editor
      [formControl]="formControl"
      [formlyAttributes]="field"
    ></kendo-editor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldHtmlEditor extends FieldType<FieldTypeConfig> {}
