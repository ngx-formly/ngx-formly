import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable, ReplaySubject, Subscription, combineLatest, defer, isObservable, merge, of } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../models';
import { FormlyConfig } from '../services/formly.config';
import { FORMLY_VALIDATORS, defineHiddenProp, observe } from '../utils';
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
    const controlChanges = new Observable<FormlyFieldConfig['formControl']>((subscriber) => {
      const observer = observe<FormlyFieldConfig['formControl']>(this.field, ['formControl'], ({ currentValue }) =>
        subscriber.next(currentValue),
      );
      return () => observer.unsubscribe();
    });
    const changes = merge(
      controlChanges.pipe(switchMap((control) => (control ? control.statusChanges.pipe(startWith(null)) : of(null)))),
      new Observable<void>((subscriber) => {
        const options = (this.field as FormlyFieldConfigCache).options;
        if (!options) {
          return undefined;
        }
        if (!options._afterBuild) {
          defineHiddenProp(options, '_afterBuild', new Set());
        }
        const afterBuild = () => subscriber.next();
        options._afterBuild.add(afterBuild);
        return () => options._afterBuild.delete(afterBuild);
      }),
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
    );

    this.errorMessage$ = defer(() => {
      const streams = new Map<Observable<string>, { latest: ReplaySubject<string>; subscription: Subscription }>();
      return changes.pipe(
        map(() => this.errorMessage),
        distinctUntilChanged(),
        map((message) => {
          for (const [source, { subscription }] of streams) {
            if (!(message instanceof CombinedMessages) || !message.messages.includes(source)) {
              subscription.unsubscribe();
              streams.delete(source);
            }
          }
          if (!(message instanceof CombinedMessages)) {
            return message;
          }

          // Keep each active translation subscribed when another message changes.
          return message.combine((source) => {
            if (!streams.has(source)) {
              const latest = new ReplaySubject<string>(1);
              latest.next('');
              const subscription = new Subscription();
              streams.set(source, { latest, subscription });
              subscription.add(source.subscribe(latest));
            }
            return streams.get(source).latest;
          });
        }),
        switchMap((message) => (isObservable(message) ? message : of(message))),
        finalize(() => streams.forEach(({ subscription }) => subscription.unsubscribe())),
      );
    });
  }

  get errorMessage() {
    const errors = Object.keys(this.field.formControl?.errors || {});
    if (!this.field.validation?.showAllErrors) {
      return errors.length ? getValidationMessage(this.field, errors[0], this.config) : undefined;
    }

    const messages = errors.map((error) => getValidationMessage(this.field, error, this.config)).filter(Boolean);
    return messages.some(isObservable) ? new CombinedMessages(messages) : messages.join('\n');
  }
}

class CombinedMessages extends Observable<string> {
  constructor(readonly messages: (string | Observable<string>)[]) {
    super((subscriber) => this.combine((source) => source.pipe(startWith(''))).subscribe(subscriber));
  }

  combine(observe: (source: Observable<string>) => Observable<string>) {
    return combineLatest(this.messages.map((message) => (isObservable(message) ? observe(message) : of(message)))).pipe(
      map((values) => values.filter(Boolean).join('\n')),
    );
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
