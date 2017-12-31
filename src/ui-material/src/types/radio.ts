import { Component, AfterViewInit, ViewChildren } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group [formControl]="formControl" [formlyAttributes]="field">
      <mat-radio-button *ngFor="let option of to.options; let i = index;" [id]="id + '_' + i" [value]="option.key">
        {{ option.value }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType implements AfterViewInit {
  @ViewChildren(MatRadioButton) matRadioButtons: MatRadioButton[];

  ngAfterViewInit() {
    if (this.field['__formField__']) {
      this.field['__formField__']._control.focusMonitor(
        this.matRadioButtons.map(matRadioButton => matRadioButton._inputElement.nativeElement),
      );
    }
  }
}
