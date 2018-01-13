import { Component, AfterViewInit, ViewChildren, Renderer2 } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group [formControl]="formControl" [formlyAttributes]="field" (change)="to.change ? to.change(field, formControl):''">
      <mat-radio-button *ngFor="let option of to.options; let i = index;" [id]="id + '_' + i" [value]="option.key">
        {{ option.value }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class FormlyFieldRadio extends FieldType implements AfterViewInit {
  @ViewChildren(MatRadioButton) matRadioButtons: MatRadioButton[];
  constructor(private renderer?: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    const formField = this.field['__formField__'];
    if (formField) {
      formField._control.focusMonitor(
        this.matRadioButtons.map(matRadioButton => matRadioButton._inputElement.nativeElement),
      );

      // temporary fix for https://github.com/angular/material2/issues/7891
      if (formField.underlineRef && this.renderer) {
        this.renderer.removeClass(formField.underlineRef.nativeElement, 'mat-form-field-underline');
      }
    }
    super.ngAfterViewInit();
  }
}
