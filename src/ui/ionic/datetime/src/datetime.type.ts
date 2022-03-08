import { Component, ChangeDetectionStrategy, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-datetime',
  template: `
    <ion-item [button]="true" [detail]="false" (click)="isOpen = true">
      <ion-label>
        {{ formControl.value ? (formControl.value | date: displayFormat()) : to.placeholder }}
      </ion-label>
    </ion-item>
    <ion-modal
      [isOpen]="isOpen"
      (didDismiss)="close()"
      [cssClass]="'ion-datetime-modal ion-datetime-modal-' + to.presentation"
    >
      <ng-template>
        <ion-datetime
          [locale]="to.locale"
          [presentation]="to.presentation"
          [cancelText]="to.cancelText"
          [dayValues]="to.dayValues"
          [doneText]="to.doneText"
          [hourValues]="to.hourValues"
          [minuteValues]="to.minuteValues"
          [monthValues]="to.monthValues"
          [yearValues]="to.yearValues"
          [min]="to.minDate ? to.minDate : to.min"
          [max]="to.maxDate ? to.maxDate : to.max"
          [formControl]="formControl"
          [ionFormlyAttributes]="field"
        >
          <ion-buttons slot="buttons">
            <ion-button (click)="reset()">{{ to.cancelText || 'Cancel' }}</ion-button>
            <ion-button (click)="confirm()">{{ to.doneText || 'Done' }}</ion-button>
          </ion-buttons>
        </ion-datetime>
      </ng-template>
    </ion-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dattime.type.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyFieldDatetime extends FieldType<FieldTypeConfig> {
  @ViewChild(IonDatetime) datetime!: IonDatetime;
  isOpen = false;

  override defaultOptions = {
    templateOptions: {
      presentation: 'date', // date | time | time-date
    },
  };

  displayFormat() {
    if (this.to.displayFormat) {
      return this.to.displayFormat;
    }

    switch (this.to.presentation) {
      case 'time-date':
        return 'short';
      case 'time':
        return 'shortTime';
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
