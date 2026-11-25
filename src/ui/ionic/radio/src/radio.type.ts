import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { FormlyFieldProps } from '@ngx-formly/ionic/form-field';

type RadioProps = FormlyFieldProps;

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-ion-radio',
  template: `
    <ion-list>
      <ion-list-header>
        @if (props.allowHtml) {
          <span [innerHTML]="props.label"></span>
        } @else {
          <ng-container>{{ props.label }}</ng-container>
        }
      </ion-list-header>
      <ion-radio-group [formControl]="formControl" [ionFormlyAttributes]="field">
        @let options = props.options | formlySelectOptions: field | async;
        @for (choice of optionSources(options); track choice; let i = $index) {
          @let option = options[i];
          <ion-item [disabled]="option.disabled || formControl.disabled">
            <ion-radio [value]="option.value">
              {{ option.label }}
            </ion-radio>
          </ion-item>
        }
      </ion-radio-group>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./radio.type.scss'],
  standalone: false,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> {
  protected readonly optionSources = FormlySelectOptionsPipe.ɵgetOptionSources;
}
