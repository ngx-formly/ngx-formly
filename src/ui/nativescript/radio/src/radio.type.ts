import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ns-radio',
  template: `
    <ng-container *ngFor="let option of to.options | formlySelectOptions:field | async;">
      <GridLayout class="input-field input-sides" rows="auto, auto" columns="*,*">
        <Label class="label" [text]="option.label"></Label>
        <Switch col="1" class="switch input"
          [checked]="formControl.value === option.value"
          (tap)="tap(option.value)">
        </Switch>
       </GridLayout>
    </ng-container>
  `,
})
export class FormlyFieldRadio extends FieldType {
  tap(id) {
    const value = this.formControl.value === id ? null : id;
    setTimeout(() => {
      this.formControl.patchValue(value);
      this.formControl.markAsTouched();
    }, 100);
  }
}
