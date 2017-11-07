import { Component, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    <ng-container *ngFor="let option of to.options">
      <mat-checkbox [formControl]="formControl.get(option.key)" [formlyAttributes]="field">{{ option.value }}</mat-checkbox>
    </ng-container>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType implements AfterViewInit {
  @ViewChildren(MatCheckbox) matCheckboxes: MatCheckbox[];

  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = new FormControl(model ? model[option.key] : undefined);
      return previous;
    }, {});

    return new FormGroup(
      controlGroupConfig,
      field.validators ? field.validators.validation : undefined,
      field.asyncValidators ? field.asyncValidators.validation : undefined,
    );
  }

  ngAfterViewInit() {
    if (this.field['__formField__']) {
      this.field['__formField__']._control.focusMonitor(
        this.matCheckboxes.map(matCheckbox => matCheckbox._inputElement.nativeElement),
      );
    }
  }
}
