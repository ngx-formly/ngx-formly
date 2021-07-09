import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <!-- ng-container used as a workaround for https://github.com/ionic-team/ionic/issues/19324 -->
    <ng-container *ngIf="to.options | formlySelectOptions: field | async; let selectOptions">
      <ion-select
        [style.align-self]="to.labelPosition === 'floating' ? 'stretch' : ''"
        [style.max-width.%]="to.labelPosition === 'floating' ? 100 : ''"
        [formControl]="formControl"
        [compareWith]="to.compareWith"
        [ionFormlyAttributes]="field"
        [multiple]="to.multiple"
        [interface]="to.interface"
        [okText]="to.okText"
        [cancelText]="to.cancelText"
      >
        <ion-select-option *ngFor="let option of selectOptions" [value]="option.value" [disabled]="option.disabled">
          {{ option.label }}
        </ion-select-option>
      </ion-select>
    </ng-container>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        if (Array.isArray(o2)) {
          return o2.indexOf(o1)>=0;
        }
        return o1 === o2;
      },
    },
  };
}
