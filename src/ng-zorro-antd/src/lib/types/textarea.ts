import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { AutoSizeType } from 'ng-zorro-antd/input/nz-autosize.directive';

interface NgZorroAntdTextareaFieldConfig extends FormlyFieldConfig {
  nzAutoSize?: string | boolean | AutoSizeType;
}

@Component({
  selector: 'formly-field-antd-textarea',
  template: `
    <textarea
      nz-input
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [rows]="to.rows"
      [cols]="to.cols"
      [nzAutosize]="autosize"
      [nzSize]="nzSize"
    ></textarea>
  `,
})
export class FormlyFieldTextArea extends FieldType<NgZorroAntdTextareaFieldConfig> {
  get autosize () {
    return this.to!.nzAutosize || false;
  }

  get nzSize() {
    return this.to!.nzSize || 'default';
  }
}
