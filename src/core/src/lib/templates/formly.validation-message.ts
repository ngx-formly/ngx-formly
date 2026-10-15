import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, combineLatest, isObservable, merge, of } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
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
  host: { '[style.white-space]': "field.validation?.showAllErrors ? 'pre-line' : null" },
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
      switchMap(() => {
        const message = this.errorMessage;
        return isObservable(message) ? message : of(message);
      }),
    );
  }

  get errorMessage() {
    const fieldForm = this.field.formControl;
    const messages: (string | Observable<string>)[] = [];
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        const message = getValidationMessage(this.field, error, this.config);
        if (!this.field.validation?.showAllErrors) {
          return message;
        }
        if (message) {
          messages.push(message);
        }
      }
    }

    if (this.field.validation?.showAllErrors) {
      return messages.some(isObservable)
        ? combineLatest(
            messages.map((message) => (isObservable(message) ? message.pipe(startWith('')) : of(message))),
          ).pipe(map((values) => values.filter(Boolean).join('\n')))
        : messages.join('\n');
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
