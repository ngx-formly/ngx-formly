import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-zorro-antd-radio',
  template: `
    <nz-radio-group >
      <ng-container *ngFor="let option of to.options | formlySelectOptions:field | async; let i = index;">
        <label nz-radio [formControl]="formControl" [nzValue]="option.value"> {{ option.label }}</label>
      </ng-container>
    </nz-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType {}
