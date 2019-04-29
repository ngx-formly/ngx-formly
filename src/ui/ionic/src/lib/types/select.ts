import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <!-- ng-container used as a workaround for https://github.com/ionic-team/ionic/issues/19324 -->
    <ng-container *ngIf="to.options | formlySelectOptions:field | async; let selectOptions">
      <ion-select
        [formControl]="formControl"
        [compareWith]="to.compareWith"
        [ionFormlyAttributes]="field"
        [multiple]="to.multiple"
        [interface]="to.interface"
        [okText]="to.okText"
        [cancelText]="to.cancelText">
        <ion-select-option *ngFor="let option of selectOptions" [value]="option.value">
            {{ option.label }}
        </ion-select-option>
      </ion-select>
    </ng-container>
  `,
  styles: [':host { display: inherit; }'],
})
export class FormlyFieldSelect extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };
}
