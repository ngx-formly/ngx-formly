import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox [formControl]="formControl" [id]="id" [formlyAttributes]="field">
      {{ to.label }}
      {{ to.required ? '*' : '' }}
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType implements AfterViewInit {
  @ViewChild(MatCheckbox) matCheckbox: MatCheckbox;

  ngAfterViewInit() {
    if (this.field['__formField__']) {
      this.field['__formField__']._control.focusMonitor([this.matCheckbox._inputElement.nativeElement]);
    }
  }
}
