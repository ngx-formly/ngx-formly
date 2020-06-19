import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Component({
  selector: 'formly-field-mat-textarea',
  template: `
    <textarea
      matInput
      [id]="id"
      [readonly]="to.readonly"
      [required]="to.required"
      [formControl]="formControl"
      [errorStateMatcher]="errorStateMatcher"
      [cols]="to.cols"
      [rows]="to.rows"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabindex]="to.tabindex"
      [cdkTextareaAutosize]="to.autosize"
      [cdkAutosizeMinRows]="to.autosizeMinRows"
      [cdkAutosizeMaxRows]="to.autosizeMaxRows"
      [class.cdk-textarea-autosize]="to.autosize"
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
export class FormlyFieldTextArea extends FieldType implements OnInit {
  @ViewChild(MatInput, { static: true }) formFieldControl!: MatInput;
  defaultOptions = {
    templateOptions: {
      cols: 1,
      rows: 1,
    },
  };
}
