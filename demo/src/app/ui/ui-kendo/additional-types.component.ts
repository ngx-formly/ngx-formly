import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/kendo/form-field';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { SliderModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
import { Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'formly-field-kendo-native-select',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, FormlySelectOptionsPipe],
  template: `
    <select
      class="k-input k-input-inner k-input-md k-rounded-md k-input-solid"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      <option [ngValue]="undefined">{{ props.placeholder }}</option>
      @for (option of props.options | formlySelectOptions: field | async; track option.value) {
        <option [ngValue]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
      }
    </select>
  `,
})
export class NativeSelectTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-kendo-datepicker',
  imports: [ReactiveFormsModule, FormlyModule, DatePickerModule],
  template: `
    <kendo-datepicker
      [formControl]="formControl"
      [formlyAttributes]="field"
      [focusableId]="id"
      [id]="id + '-container'"
      [inputAttributes]="{ 'aria-label': props.label }"
      [placeholder]="props.placeholder"
    />
  `,
})
export class DatepickerTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-kendo-toggle',
  imports: [ReactiveFormsModule, FormlyModule, SwitchModule],
  template: `<kendo-switch [formControl]="formControl" [formlyAttributes]="field" [attr.aria-label]="props.label" />`,
})
export class ToggleTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-kendo-slider',
  imports: [ReactiveFormsModule, FormlyModule, SliderModule],
  template: `
    <kendo-slider
      [focusableId]="id"
      [id]="id + '-container'"
      [dragHandleTitle]="props.label"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [attr.aria-label]="props.label"
      [min]="props.min ?? 0"
      [max]="props.max ?? 100"
      [smallStep]="props.step ?? 1"
      [tickPlacement]="'none'"
    />
  `,
})
export class SliderTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-kendo-autocomplete',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, AutoCompleteModule],
  template: `
    <kendo-autocomplete
      [formControl]="formControl"
      [formlyAttributes]="field"
      [focusableId]="id"
      [id]="id + '-container'"
      [inputAttributes]="{ 'aria-label': props.label }"
      [placeholder]="props.placeholder"
      [filterable]="true"
      [data]="(suggestions | async) ?? []"
      (filterChange)="queries.next($event)"
    />
  `,
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> {
  queries = new Subject<string>();
  suggestions = this.queries.pipe(switchMap((term): Observable<string[]> => this.props.filter(term)));
}

export const additionalTypes: ConfigOption = {
  types: [
    { name: 'native-select', component: NativeSelectTypeComponent, wrappers: ['form-field'] },
    { name: 'datepicker', component: DatepickerTypeComponent, wrappers: ['form-field'] },
    { name: 'toggle', component: ToggleTypeComponent, wrappers: ['form-field'] },
    { name: 'slider', component: SliderTypeComponent, wrappers: ['form-field'] },
    { name: 'autocomplete', component: AutocompleteTypeComponent, wrappers: ['form-field'] },
  ],
};
