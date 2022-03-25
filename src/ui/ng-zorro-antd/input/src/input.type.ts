import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-input',
  template: `
    <input
      *ngIf="props.type !== 'number'; else numberTmp"
      nz-input
      [formControl]="formControl"
      [type]="props.type || 'text'"
      [formlyAttributes]="field"
    />
    <ng-template #numberTmp>
      <nz-input-number [formControl]="formControl" [formlyAttributes]="field"></nz-input-number>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig> {}
