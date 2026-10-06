import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'formly-field-primeng-native-select',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, FormlySelectOptionsPipe, InputTextModule],
  template: `
    <select pInputText fluid [formControl]="formControl" [formlyAttributes]="field">
      <option [ngValue]="undefined">{{ props.placeholder }}</option>
      @for (option of props.options | formlySelectOptions: field | async; track option.value) {
        <option [ngValue]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
      }
    </select>
  `,
})
export class NativeSelectTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-primeng-toggle',
  imports: [ReactiveFormsModule, FormlyModule, ToggleSwitchModule],
  template: `<p-toggleswitch
    [inputId]="id"
    [id]="id + '-container'"
    [formControl]="formControl"
    [formlyAttributes]="field"
  />`,
})
export class ToggleTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-primeng-slider',
  imports: [ReactiveFormsModule, FormlyModule, SliderModule],
  template: `
    <p-slider
      [formControl]="formControl"
      [formlyAttributes]="field"
      [ariaLabel]="props.label"
      [min]="props.min ?? 0"
      [max]="props.max ?? 100"
      [step]="props.step ?? 1"
    />
  `,
  styles: [':host { display: block; padding: 0.5rem; }'],
})
export class SliderTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-primeng-autocomplete',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyModule, AutoCompleteModule],
  template: `
    <p-autocomplete
      [fluid]="true"
      [inputId]="id"
      [id]="id + '-container'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [suggestions]="suggestions | async"
      (completeMethod)="queries.next($event.query)"
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
    { name: 'toggle', component: ToggleTypeComponent, wrappers: ['form-field'] },
    { name: 'slider', component: SliderTypeComponent, wrappers: ['form-field'] },
    { name: 'autocomplete', component: AutocompleteTypeComponent, wrappers: ['form-field'] },
  ],
};
