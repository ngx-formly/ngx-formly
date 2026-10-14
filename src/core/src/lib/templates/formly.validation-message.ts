import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, isObservable, merge, of } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { FormlyFieldConfig } from '../models';
import { FormlyConfig } from '../services/formly.config';
import { FORMLY_VALIDATORS } from '../utils';
import { getValidationMessage } from './validation-message';

/**
 * The `<formly-validation-message>` component renders the error message of a given `field`.
 * @deprecated Use the `validationMessages` pipe to render validation messages.
 */
@Component({
  selector: 'formly-validation-message',
  template: '{{ errorMessage$ | async }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe],
})
export class FormlyValidationMessage implements OnChanges {
  /** The field config. */
  @Input() field: FormlyFieldConfig;
  errorMessage$: Observable<string>;

  constructor(private config: FormlyConfig) {}

  ngOnChanges() {
    const EXPR_VALIDATORS = FORMLY_VALIDATORS.map((v) => `templateOptions.${v}`);
    this.errorMessage$ = merge(
      this.field.formControl.statusChanges,
      !this.field.options
        ? of(null)
        : this.field.options.fieldChanges.pipe(
            filter(({ field, type, property }) => {
              return (
                field === this.field &&
                type === 'expressionChanges' &&
                (property.indexOf('validation') !== -1 || EXPR_VALIDATORS.indexOf(property) !== -1)
              );
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
        return getValidationMessage(this.field, error, this.config);
      }
    }

    return undefined;
  }
}

/** @deprecated Use the `validationMessages` pipe to render validation messages. */
@Component({
  selector: 'formly-validation-message',
  template: '{{ errorMessage$ | async }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LegacyFormlyValidationMessage extends FormlyValidationMessage {}
