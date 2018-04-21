import { Component, Renderer2, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'formly-field-mat-toggle',
  template: `
    <mat-slide-toggle [formControl]="formControl" [formlyAttributes]="field">
      {{ to.label }}
    </mat-slide-toggle>
  `,
})
export class FormlyToggleTypeComponent extends FieldType implements AfterViewInit {
  constructor(private renderer: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.formField && this.formField.underlineRef) {
      this.renderer.removeClass(this.formField.underlineRef.nativeElement, 'mat-form-field-underline');
    }
  }
}
