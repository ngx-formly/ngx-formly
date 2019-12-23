import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { isObject } from '../utils';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'formly-validation-message',
  template: `{{ errorMessage$ | async }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyValidationMessage implements OnChanges {
  @Input() field: FormlyFieldConfig;
  errorMessage$: Observable<string>;

  constructor(private formlyConfig: FormlyConfig) {}

  ngOnChanges() {
    this.errorMessage$ = this.field.formControl.statusChanges.pipe(
      startWith(null),
      map(() => this.errorMessage),
    );
  }

  get errorMessage(): string {
    const fieldForm = this.field.formControl;
    for (let error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message: string | Function = this.formlyConfig.getValidatorMessage(error);

        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            return;
          }

          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (this.field.validation && this.field.validation.messages && this.field.validation.messages[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators && this.field.validators[error] && this.field.validators[error].message) {
          message = this.field.validators[error].message;
        }

        if (this.field.asyncValidators && this.field.asyncValidators[error] && this.field.asyncValidators[error].message) {
          message = this.field.asyncValidators[error].message;
        }

        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }

        return message;
      }
    }
  }
}
