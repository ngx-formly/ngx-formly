import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FieldType } from './field';

@Component({
  selector: 'formly-field-mat-input',
  template: `
    <input matInput
      [id]="id"
      [type]="to.type || 'text'"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field">
  `,
})
export class FormlyFieldInput extends FieldType implements OnInit {
  @ViewChild(MatInput) formFieldControl: MatInput;
}
