import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-input',
  template: `
    <input
      *ngIf="to.type !== 'number'; else numberTmp"
      nz-input
      [formControl]="formControl"
      [type]="to.type || 'text'"
      [formlyAttributes]="field"
    />
    <ng-template #numberTmp>
      <nz-input-number [formControl]="formControl" [formlyAttributes]="field"></nz-input-number>
    </ng-template>
  `,
})
export class FormlyFieldInput extends FieldType {}
