import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
    <input
      *ngIf="type !== 'number'; else numberTmp"
      [type]="type"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
    />
    <ng-template #numberTmp>
      <input
        type="number"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig> {
  get type() {
    return this.to.type || 'text';
  }
}
