import { Component } from '@angular/core';
import { Field } from '@ngx-formly/core';
@Component({
  selector: 'formly-field-toggle',
  template: `
    <div [formGroup]="form" *ngIf="!formState.readOnly">
      <div class="checkbox-toggle" [ngClass]="isLarge">
          <input id="checkbox" type="checkbox" type="checkbox" [formControlName]="key" value="on">
          <label for="checkbox" [ngClass]="isAlert">
              <div></div>
          </label>
      </div>
  </div>
  <div *ngIf="formState.readOnly">
    {{ model[key] }}
  </div>
  `,
})
export class FormlyFieldToggle extends Field {
  get isAlert() {
    if (this.to['isAlert']) {
      return 'toggle-alert';
    }
    return '';
  }

  get isLarge() {
    if (this.to['isLarge']) {
      return 'checkbox-toggle--large';
    }
    return '';
  }
}
