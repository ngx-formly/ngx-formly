import { Component, ChangeDetectionStrategy, ViewChild, ViewEncapsulation, Type } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

interface DatetimeProps extends FormlyFieldProps {
  presentation?: 'date' | 'date-time' | 'month' | 'month-year' | 'time' | 'time-date' | 'year';
  locale?: any;
  cancelText?: string;
  doneText?: string;
  dayValues?: number | number[] | string | undefined;
  hourValues?: number | number[] | string | undefined;
  minuteValues?: number | number[] | string | undefined;
  monthValues?: number | number[] | string | undefined;
  yearValues?: number | number[] | string | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  displayFormat?: string;
}

export interface FormlyDatetimeFieldConfig extends FormlyFieldConfig<DatetimeProps> {
  type: 'datetime' | Type<FormlyFieldDatetime>;
}

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-item [button]="true" [detail]="false" (click)="isOpen = true">
      <ion-label>
        {{ formControl.value ? (formControl.value | date : displayFormat()) : props.placeholder }}
      </ion-label>
    </ion-item>
    <ion-modal
      [isOpen]="isOpen"
      (didDismiss)="close()"
      [cssClass]="'ion-datetime-modal ion-datetime-modal-' + props.presentation"
    >
      <ng-template>
        <ion-datetime
          [locale]="props.locale"
          [presentation]="props.presentation"
          [cancelText]="props.cancelText"
          [dayValues]="props.dayValues"
          [doneText]="props.doneText"
          [hourValues]="props.hourValues"
          [minuteValues]="props.minuteValues"
          [monthValues]="props.monthValues"
          [yearValues]="props.yearValues"
          [min]="props.minDate ? props.minDate : props.min"
          [max]="props.maxDate ? props.maxDate : props.max"
          [formControl]="formControl"
          [ionFormlyAttributes]="field"
        >
          <ion-buttons slot="buttons">
            <ion-button (click)="reset()">{{ props.cancelText || 'Cancel' }}</ion-button>
            <ion-button (click)="confirm()">{{ props.doneText || 'Done' }}</ion-button>
          </ion-buttons>
        </ion-datetime>
      </ng-template>
    </ion-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dattime.type.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyFieldDatetime extends FieldType<FieldTypeConfig<DatetimeProps>> {
  @ViewChild(IonDatetime) datetime!: IonDatetime;
  isOpen = false;

  override defaultOptions = {
    props: {
      presentation: 'month-year' as const,
    },
  };

  displayFormat() {
    if (this.props.displayFormat) {
      return this.props.displayFormat;
    }

    switch (this.props.presentation) {
      case 'date-time':
      case 'time-date':
        return 'short';
      case 'time':
        return 'shortTime';
      case 'month':
        return 'MMMM';
      case 'month-year':
        return 'MMMM, y';
      case 'year':
        return 'y';
      case 'date':
        return 'mediumDate';
    }
  }

  confirm() {
    this.datetime?.confirm();
    this.close();
  }

  reset() {
    this.datetime?.reset();
    this.close();
  }

  close() {
    this.isOpen = false;
    this.formControl.markAsTouched();
  }
}
