import { Component } from '@angular/core';
import { Field } from '../src/core/templates/field';
@Component({
  selector: 'formly-field-toggle',
  template: `
    <div [formGroup]="form">
      <div class="checkbox-toggle">
          <input id="checkbox" type="checkbox" type="checkbox" [formControlName]="key" value="on">
          <label for="checkbox" [ngClass]="isAlert">
              <div></div>
          </label>
      </div>
  </div>
  `,
})
export class FormlyFieldToggle extends Field {
  get isAlert() {
    if (this.templateOptions['isAlert']) {
      return 'toggle-alert';
    }
    return '';
  }
}
