import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-textarea',
  template: `
    <textarea nz-input [formControl]="formControl" [formlyAttributes]="field"></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType {}
