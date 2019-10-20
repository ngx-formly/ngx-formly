import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-input',
  template: `
    <ion-input
      *ngIf="to.type !== 'number'; else numberTmp"
      [type]="to.type || 'text'"
      [formControl]="formControl"
      [ionFormlyAttributes]="field"
    ></ion-input>
    <ng-template #numberTmp>
      <ion-input type="number" [formControl]="formControl" [ionFormlyAttributes]="field"></ion-input>
    </ng-template>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldInput extends FieldType {}
