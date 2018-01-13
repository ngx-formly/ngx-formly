import { Component, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [formlyAttributes]="field"
      (change)="to.change ? to.change(field, formControl):''"
      [indeterminate]="model[id] === undefined"
      [align]="to.align">
      {{ to.label }}
      {{ to.required ? '*' : '' }}
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType implements AfterViewInit {
  @ViewChild(MatCheckbox) matCheckbox: MatCheckbox;

  constructor(private renderer?: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    const formField = this.field['__formField__'];
    if (formField) {
      formField._control.focusMonitor([this.matCheckbox._inputElement.nativeElement]);

      // temporary fix for https://github.com/angular/material2/issues/7891
      if (formField.underlineRef && this.renderer) {
        this.renderer.removeClass(formField.underlineRef.nativeElement, 'mat-form-field-underline');
      }
    }
    super.ngAfterViewInit();
  }
}
