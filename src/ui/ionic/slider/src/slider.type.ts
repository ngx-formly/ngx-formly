import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ion-range',
  template: `
    <ion-range [min]="to.min" [max]="to.max" [formControl]="formControl" [ionFormlyAttributes]="field">
      <ion-label slot="start">{{ to.min }}</ion-label>
      <ion-label slot="end">{{ to.max }}</ion-label>
    </ion-range>
  `,
  styles: [':host { display: inherit; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType {}
