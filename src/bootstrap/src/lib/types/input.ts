import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
    <input *ngIf="type !== 'number' else numberTmp" [type]="type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    <ng-template #numberTmp>
      <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    </ng-template>
  `,
  host: {
    '[class.d-inline-flex]': 'to.addonLeft || to.addonRight',
    '[class.custom-file]': 'to.addonLeft || to.addonRight',
  },
})
export class FormlyFieldInput extends FieldType {
  get type() {
    return this.to.type || 'text';
  }
}
