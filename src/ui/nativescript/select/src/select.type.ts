import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { action } from '@nativescript/core/ui/dialogs';
import { FormlyFieldProps } from '@ngx-formly/nativescript/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-ns-select',
  template: `
    <ng-container *ngIf="props.options | formlySelectOptions : field | async as options">
      <Button (tap)="tap(options)" [text]="selectedItem(options)"></Button>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  tap(options: any[]) {
    action({ title: this.props.label, actions: options.map((o) => o.label) }).then((selectedAction) =>
      this.formControl.patchValue(options.find((o) => o.label === selectedAction).value),
    );
  }

  selectedItem(options: any[]) {
    if (this.formControl.value) {
      return options.find((o) => o.value === this.formControl.value).label;
    }

    return this.props.placeholder;
  }
}
