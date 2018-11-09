import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'formly-field-mat-textarea',
  template: `
    <textarea matInput
      [id]="id"
      [readonly]="to.readonly"
      [formControl]="formControl"
      [errorStateMatcher]="errorStateMatcher"
      [cols]="to.cols"
      [rows]="to.rows"
      [placeholder]="to.placeholder"
      [formlyAttributes]="field">
    </textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType implements OnInit {
  @ViewChild(MatInput) formFieldControl: MatInput;
}
