import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'formly-field-mat-toggle',
  template: `
    <mat-slide-toggle [formControl]="formControl" [formlyAttributes]="field">
      {{ to.label }}
    </mat-slide-toggle>
  `,
})
export class FormlyToggleTypeComponent extends FieldType {}
