import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType } from './field';
import { Observable } from 'rxjs';

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    <ng-container *ngFor="let option of to.options; let i = index;">
      <mat-checkbox [id]="id + '_' + i"
        [formControl]="formControl.get(option.key)"
        [formlyAttributes]="field"
        [color]="to.color"
        [labelPosition]="to.labelPosition">
          {{ option.value }}
      </mat-checkbox>
    </ng-container>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    if (!(field.templateOptions.options instanceof Observable)) {
      let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
        previous[option.key] = new FormControl(model ? model[option.key] : undefined);
        return previous;
      }, {});

      return new FormGroup(
        controlGroupConfig,
        field.validators ? field.validators.validation : undefined,
        field.asyncValidators ? field.asyncValidators.validation : undefined,
      );
    } else {
      throw new Error(`[Formly Error] You cannot pass an Observable to a multicheckbox yet.`);
    }
  }
}
