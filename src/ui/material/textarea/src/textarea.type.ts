import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Component({
  selector: 'formly-field-mat-textarea',
  template: `
    <textarea
      matInput
      [id]="id"
      [readonly]="props.readonly"
      [required]="required"
      [formControl]="formControl"
      [errorStateMatcher]="errorStateMatcher"
      [cols]="props.cols"
      [rows]="props.rows"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [tabindex]="props.tabindex"
      [cdkTextareaAutosize]="props.autosize"
      [cdkAutosizeMinRows]="props.autosizeMinRows"
      [cdkAutosizeMaxRows]="props.autosizeMaxRows"
      [class.cdk-textarea-autosize]="props.autosize"
    >
    </textarea>
  `,
  providers: [
    // fix for https://github.com/ngx-formly/ngx-formly/issues/1688
    // rely on formControl value instead of elementRef which return empty value in Firefox.
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: FormlyFieldTextArea },
  ],
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
