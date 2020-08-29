import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-tabs',
  template: `
  <mat-tab-group>
    <mat-tab *ngFor="let tab of field.fieldGroup; let i = index; let last = last;"
      [label]="tab.templateOptions.label"
      [disabled]="i !== 0 && !isValid(field.fieldGroup[i - 1])">
      <formly-field [field]="tab"></formly-field>

      <button *ngIf="last" class="btn btn-primary" [disabled]="!form.valid" type="submit">
        Submit
      </button>
    </mat-tab>
  </mat-tab-group>
`,
})
export class FormlyFieldTabs extends FieldType {
  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every(f => this.isValid(f));
  }
}
