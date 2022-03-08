import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig } from '../models';
import { isObject } from '../utils';
import { Observable, isObservable, of } from 'rxjs';
import { merge } from 'rxjs';
import { startWith, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'formly-validation-message',
  template: '{{ errorMessage$ | async }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyValidationMessage implements OnChanges {
  @Input() field: FormlyFieldConfig;
  errorMessage$: Observable<string>;

  constructor(private config: FormlyConfig) {}

  ngOnChanges() {
    this.errorMessage$ = merge(
      this.field.formControl.statusChanges,
      !this.field.options
        ? of(null)
        : this.field.options.fieldChanges.pipe(
            filter(({ field, type, property }) => {
              return field === this.field && type === 'expressionChanges' && property.indexOf('validation') !== -1;
            }),
          ),
    ).pipe(
      startWith(null),
      switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage))),
    );
  }

  get errorMessage() {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message = this.config.getValidatorMessage(error);

        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            return undefined;
          }

          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (this.field.validation?.messages?.[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators?.[error]?.message) {
          message = this.field.validators[error].message;
        }

        if (this.field.asyncValidators?.[error]?.message) {
          message = this.field.asyncValidators[error].message;
        }

        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }

        return message;
      }
    }

    return undefined;
  }
}
