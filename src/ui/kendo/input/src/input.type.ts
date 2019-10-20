import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-kendo-input',
  template: `
    <input
      *ngIf="to.type !== 'number'; else numberTmp"
      [type]="to.type || 'text'"
      [formControl]="formControl"
      class="k-textbox"
      [formlyAttributes]="field"
      [class.k-state-invalid]="showError"
    />
    <ng-template #numberTmp>
      <input
        type="number"
        [formControl]="formControl"
        class="k-textbox"
        [formlyAttributes]="field"
        [class.k-state-invalid]="showError"
      />
    </ng-template>
  `,
})
export class FormlyFieldInput extends FieldType {}
