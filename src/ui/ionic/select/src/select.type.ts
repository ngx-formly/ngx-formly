import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-select',
  template: `
    <!-- ng-container used as a workaround for https://github.com/ionic-team/ionic/issues/19324 -->
    <ng-container *ngIf="props.options | formlySelectOptions: field | async; let selectOptions">
      <ion-select
        [style.align-self]="props.labelPosition === 'floating' ? 'stretch' : ''"
        [style.max-width.%]="props.labelPosition === 'floating' ? 100 : ''"
        [formControl]="formControl"
        [compareWith]="props.compareWith"
        [ionFormlyAttributes]="field"
        [multiple]="props.multiple"
        [interface]="props.interface"
        [okText]="props.okText"
        [cancelText]="props.cancelText"
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
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {
  override defaultOptions = {
    props: {
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };
}
