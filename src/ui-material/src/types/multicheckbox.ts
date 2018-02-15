import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType } from './field';

@Component({
  selector: 'formly-field-mat-multicheckbox',
  template: `
    <ng-container *ngFor="let option of to.options; let i = index;">
      <mat-checkbox [id]="id + '_' + i" [formControl]="formControl.get(option.key)" [formlyAttributes]="field">{{ option.value }}</mat-checkbox>
    </ng-container>
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType implements AfterViewInit {
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

  constructor(private renderer?: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    if (this.formField) {
      // temporary fix for https://github.com/angular/material2/issues/7891
      if (this.formField.underlineRef && this.renderer) {
        this.renderer.removeClass(this.formField.underlineRef.nativeElement, 'mat-form-field-underline');
      }
    }
    super.ngAfterViewInit();
  }
}
