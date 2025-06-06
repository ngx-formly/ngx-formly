import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { NgFor, NgIf } from '@angular/common';
import { FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-tabs',
  template: `
    <mat-tab-group>
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.props.label"
        [disabled]="i !== 0 && !isValid(field.fieldGroup[i - 1])"
      >
        <formly-field [field]="tab"></formly-field>

        <button *ngIf="last" class="btn btn-primary" [disabled]="!form.valid" type="submit">Submit</button>
      </mat-tab>
    </mat-tab-group>
  `,
  standalone: true,
  imports: [MatTabGroup, NgFor, MatTab, FormlyField, NgIf],
})
export class FormlyFieldTabs extends FieldType {
  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
