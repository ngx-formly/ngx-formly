import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MatStepper, MatStep, MatStepLabel, MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';

import { FormlyField } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-stepper',
  template: `
    <mat-horizontal-stepper>
      @for (step of field.fieldGroup; track step; let index = $index; let last = $last) {
        <mat-step [completed]="isValid(step)">
          <ng-template matStepLabel>{{ step.props.label }}</ng-template>
          <formly-field [field]="step"></formly-field>
          <div>
            @if (index !== 0) {
              <button matStepperPrevious class="btn btn-primary" type="button">Back</button>
            }
            @if (!last) {
              <button matStepperNext class="btn btn-primary" type="button" [disabled]="!isValid(step)">Next</button>
            }
            @if (last) {
              <button class="btn btn-primary" [disabled]="!form.valid" type="submit">Submit</button>
            }
          </div>
        </mat-step>
      }
    </mat-horizontal-stepper>
  `,
  imports: [MatStepper, MatStep, MatStepLabel, FormlyField, MatStepperPrevious, MatStepperNext],
})
export class FormlyFieldStepper extends FieldType {
  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
