import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-button',
  template: `
    <div>
      <button [type]="to.type" [ngClass]="'btn btn-' + to.btnType" (click)="onClick($event)">
        {{ to.text }}
      </button>
    </div>
  `,
})
export class FormlyFieldButton extends FieldType {
  onClick($event) {
    if (this.to.onClick) {
      this.to.onClick($event);
    }
  }
}
