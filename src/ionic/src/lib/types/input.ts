import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-field-ion-input',
  template: `
    <ion-input *ngIf="to.type !== 'number' else numberTmp" [type]="to.type || 'text'" [formControl]="formControl" [formlyAttributes]="field" (ionChange)="change($event)"></ion-input>
    <ng-template #numberTmp>
      <ion-input type="number" [formControl]="formControl" [formlyAttributes]="field" (ionChange)="change($event)"></ion-input>
    </ng-template>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldInput extends FieldType {}
