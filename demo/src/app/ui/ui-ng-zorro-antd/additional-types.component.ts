import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'formly-field-nz-native-select',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, FormlySelectOptionsPipe],
  template: `
    <select class="ant-input" [formControl]="formControl" [formlyAttributes]="field">
      <option [ngValue]="undefined">{{ props.placeholder }}</option>
      @for (option of props.options | formlySelectOptions: field | async; track option.value) {
        <option [ngValue]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
      }
    </select>
  `,
})
export class NativeSelectTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-nz-datepicker',
  imports: [ReactiveFormsModule, FormlyModule, NzDatePickerModule],
  template: `
    <nz-date-picker
      [nzId]="id"
      [id]="id + '-container'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzPlaceHolder]="props.placeholder"
      style="width: 100%"
    />
  `,
})
export class DatepickerTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-nz-toggle',
  imports: [ReactiveFormsModule, FormlyModule, NzSwitchModule],
  template: `<nz-switch [nzId]="id" [id]="id + '-container'" [formControl]="formControl" [formlyAttributes]="field" />`,
})
export class ToggleTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-nz-slider',
  imports: [ReactiveFormsModule, FormlyModule, NzSliderModule],
  template: `
    <nz-slider
      [formControl]="formControl"
      [formlyAttributes]="field"
      [attr.aria-label]="props.label"
      [nzMin]="props.min ?? 0"
      [nzMax]="props.max ?? 100"
      [nzStep]="props.step ?? 1"
    />
  `,
})
export class SliderTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-nz-autocomplete',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, NzInputModule, NzAutocompleteModule],
  template: `
    <input
      nz-input
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [nzAutocomplete]="auto"
    />
    <nz-autocomplete #auto>
      @for (option of suggestions | async; track option) {
        <nz-auto-option [nzValue]="option">{{ option }}</nz-auto-option>
      }
    </nz-autocomplete>
  `,
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> implements OnInit {
  suggestions: Observable<string[]>;

  ngOnInit() {
    this.suggestions = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value ?? ''),
      switchMap((term): Observable<string[]> => this.props.filter(term ?? '')),
    );
  }
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
