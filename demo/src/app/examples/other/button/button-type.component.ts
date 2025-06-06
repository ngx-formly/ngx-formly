import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'formly-field-button',
  template: `
    <div>
      <button [type]="props.type" [ngClass]="'btn btn-' + props.btnType" (click)="onClick($event)">
        {{ props.text }}
      </button>
    </div>
  `,
  standalone: true,
  imports: [NgClass],
})
export class FormlyFieldButton extends FieldType {
  onClick($event: Event) {
    if (this.props.onClick) {
      this.props.onClick($event);
    }
  }
}
