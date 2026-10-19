import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isObservable, Observable, of, Subscription } from 'rxjs';
import { FormlyFieldConfig, FormlyValueChangeEvent } from '../models';
import { FormlyConfig } from '../services/formly.config';
import { getValidationMessage } from './validation-message';

export interface FormlyValidationMessageEntry {
  /** The visible field associated with the error. */
  field: FormlyFieldConfig;
  /** The key in the control's errors object. */
  error: string;
  /** The resolved, nonempty validation message. */
  message: string;
}

/** Collects configured messages from built fields, independently of touched or submitted state. */
@Pipe({ name: 'validationMessages', standalone: true })
export class FormlyValidationMessagesPipe implements PipeTransform {
  constructor(private config: FormlyConfig) {}

  transform(
    fields: FormlyFieldConfig | readonly FormlyFieldConfig[] | null | undefined,
  ): Observable<FormlyValidationMessageEntry[]> {
    const roots: readonly FormlyFieldConfig[] = Array.isArray(fields) ? fields : [fields as FormlyFieldConfig];

    return new Observable<FormlyValidationMessageEntry[]>((subscriber) => {
      const subscriptions = new Map<Observable<string | FormlyValueChangeEvent>, Subscription>();
      const messages = new Map<
        FormlyFieldConfig,
        Map<
          string,
          {
            control: AbstractControl;
            message: string | Observable<string>;
            entry: FormlyValidationMessageEntry;
            subscription: Subscription;
          }
        >
      >();
      let currentFields: FormlyFieldConfig[] = [];
      let watchedFields: Set<FormlyFieldConfig>;
      let refreshing = false;

      const emit = () => {
        if (refreshing || subscriber.closed) {
          return;
        }

        const seen = new Map<AbstractControl, Set<string>>();
        const entries = currentFields.flatMap((field) =>
          Object.keys(field.formControl?.errors || {}).map((error) => messages.get(field)?.get(error)?.entry),
        );
        subscriber.next(
          entries.filter((entry) => {
            if (!entry?.message || seen.get(entry.field.formControl)?.has(entry.error)) {
              return false;
            }

            const { field, error } = entry;
            if (!seen.has(field.formControl)) {
              seen.set(field.formControl, new Set());
            }
            seen.get(field.formControl).add(error);
            return true;
          }),
        );
      };

      const refresh = () => {
        if (subscriber.closed) {
          return;
        }

        refreshing = true;
        currentFields = this.getFields(roots);
        watchedFields = new Set(currentFields);
        messages.forEach((fieldMessages, field) => {
          if (!watchedFields.has(field) || !this.isVisible(field)) {
            fieldMessages.forEach((state) => state.subscription.unsubscribe());
            messages.delete(field);
          }
        });
        currentFields.forEach((field) => {
          for (let parent = field.parent; parent && !watchedFields.has(parent); parent = parent.parent) {
            watchedFields.add(parent);
          }
        });

        const sources = new Set<Observable<string | FormlyValueChangeEvent>>();
        watchedFields.forEach((field) => {
          if (field.formControl) {
            sources.add(field.formControl.statusChanges);
          }
          if (field.options?.fieldChanges) {
            sources.add(field.options.fieldChanges);
          }
        });

        subscriptions.forEach((subscription, source) => {
          if (!sources.has(source)) {
            subscription.unsubscribe();
            subscriptions.delete(source);
          }
        });
        sources.forEach((source) => {
          if (!subscriber.closed && !subscriptions.has(source)) {
            subscriptions.set(
              source,
              source.subscribe({
                next: (event: string | FormlyValueChangeEvent) => {
                  if (
                    typeof event === 'string' ||
                    event.type === 'valueChanges' ||
                    (watchedFields.has(event.field) && ['expressionChanges', 'hidden'].includes(event.type))
                  ) {
                    refresh();
                  }
                },
                error: (error) => subscriber.error(error),
              }),
            );
          }
        });

        currentFields.forEach((field) => {
          if (subscriber.closed || !this.isVisible(field)) {
            return;
          }

          if (!messages.has(field)) {
            messages.set(field, new Map());
          }
          const fieldMessages = messages.get(field);
          const errors = new Set(Object.keys(field.formControl.errors || {}));
          fieldMessages.forEach((state, error) => {
            if (state.control !== field.formControl || !errors.has(error)) {
              state.subscription.unsubscribe();
              fieldMessages.delete(error);
            }
          });
          errors.forEach((error) => {
            if (subscriber.closed) {
              return;
            }

            let message: string | Observable<string>;
            try {
              message = getValidationMessage(field, error, this.config);
            } catch (error) {
              subscriber.error(error);
              return;
            }

            const previous = fieldMessages.get(error);
            // Re-evaluate field context, but retain unchanged streams and their latest translations.
            if (previous?.message === message) {
              return;
            }
            previous?.subscription.unsubscribe();
            fieldMessages.delete(error);
            if (!message) {
              return;
            }

            const state = {
              control: field.formControl,
              message,
              entry: null as FormlyValidationMessageEntry,
              subscription: new Subscription(),
            };
            fieldMessages.set(error, state);
            state.subscription.add(
              (isObservable(message) ? message : of(message)).subscribe({
                next: (message) => {
                  state.entry = { field, error, message };
                  emit();
                },
                error: (error) => subscriber.error(error),
              }),
            );
          });
        });
        refreshing = false;
        emit();
      };

      subscriber.add(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        messages.forEach((fieldMessages) => fieldMessages.forEach((state) => state.subscription.unsubscribe()));
      });
      refresh();
    });
  }

  private getFields(roots: readonly FormlyFieldConfig[]) {
    const fields = new Set<FormlyFieldConfig>();
    const visit = (field: FormlyFieldConfig) => {
      if (!field || fields.has(field)) {
        return;
      }

      fields.add(field);
      field.fieldGroup?.forEach(visit);
    };
    roots.forEach(visit);

    return Array.from(fields);
  }

  private isVisible(field: FormlyFieldConfig) {
    if (!field.formControl || field.formControl.disabled) {
      return false;
    }
    for (let parent = field; parent; parent = parent.parent) {
      if (parent.hide) {
        return false;
      }
    }

    return true;
  }
}
