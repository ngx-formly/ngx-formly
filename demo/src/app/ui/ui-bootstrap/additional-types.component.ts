import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigOption, FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'formly-field-bootstrap-datepicker',
  imports: [ReactiveFormsModule, FormlyModule, NgbDatepickerModule],
  template: `
    <div class="input-group">
      <input
        class="form-control"
        ngbDatepicker
        #picker="ngbDatepicker"
        [class.is-invalid]="showError"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder"
      />
      <button
        class="btn btn-outline-secondary"
        type="button"
        aria-label="Open calendar"
        [disabled]="formControl.disabled"
        (click)="picker.toggle()"
      >
        Calendar
      </button>
    </div>
  `,
})
export class DatepickerTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-bootstrap-slider',
  imports: [ReactiveFormsModule, FormlyModule],
  template: `
    <input
      type="range"
      class="form-range"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [min]="props.min ?? 0"
      [max]="props.max ?? 100"
      [step]="props.step ?? 1"
    />
  `,
})
export class SliderTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-bootstrap-autocomplete',
  imports: [ReactiveFormsModule, FormlyModule, NgbTypeaheadModule],
  encapsulation: ViewEncapsulation.None,
  styles: ['.formly-bootstrap-autocomplete-options { max-height: 240px; overflow-y: auto; }'],
  template: `
    <input
      class="form-control"
      [class.is-invalid]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [ngbTypeahead]="search"
      popupClass="formly-bootstrap-autocomplete-options"
      [placeholder]="props.placeholder"
    />
  `,
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> {
  search = (terms: Observable<string>): Observable<string[]> =>
    terms.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((term): Observable<string[]> => this.props.filter(term)),
    );
}

export const additionalTypes: ConfigOption = {
  types: [
    { name: 'native-select', extends: 'select' },
    { name: 'datepicker', component: DatepickerTypeComponent, wrappers: ['form-field'] },
    {
      name: 'toggle',
      extends: 'checkbox',
      defaultOptions: { props: { formCheck: 'switch', indeterminate: false, attributes: { role: 'switch' } } },
    },
    { name: 'slider', component: SliderTypeComponent, wrappers: ['form-field'] },
    { name: 'autocomplete', component: AutocompleteTypeComponent, wrappers: ['form-field'] },
  ],
};
