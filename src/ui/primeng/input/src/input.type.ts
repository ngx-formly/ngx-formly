import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-primeng-input',
  template: `
    <input
      *ngIf="to.type !== 'number'; else numberTmp"
      pInputText
      [type]="to.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [class.ng-dirty]="showError"
    />
    <ng-template #numberTmp>
      <input
        type="number"
        pInputText
        [formControl]="formControl"
        [formlyAttributes]="field"
        [class.ng-dirty]="showError"
      />
    </ng-template>
  `,
})
export class FormlyFieldInput extends FieldType {}
