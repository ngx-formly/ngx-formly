import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { combineLatest, defer, isObservable, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
        {
          control: AbstractControl;
          errors: AbstractControl['errors'];
          entries: FormlyValidationMessageEntry[];
          subscription: Subscription;
        }
      >();
      let currentFields: FormlyFieldConfig[] = [];
      let watchedFields: Set<FormlyFieldConfig>;
      let refreshing = false;

      const emit = () => {
        if (refreshing || subscriber.closed) {
          return;
        }

        const seen = new Map<AbstractControl, Set<string>>();
        const entries = currentFields.flatMap((field) => messages.get(field)?.entries || []);
        subscriber.next(
          entries.filter(({ field, error, message }) => {
            if (!message || seen.get(field.formControl)?.has(error)) {
              return false;
            }

            if (!seen.has(field.formControl)) {
              seen.set(field.formControl, new Set());
            }
            seen.get(field.formControl).add(error);
            return true;
          }),
        );
      };

      const refresh = (
        changedSource?: Observable<string | FormlyValueChangeEvent>,
        changedField?: FormlyFieldConfig,
      ) => {
        if (subscriber.closed) {
          return;
        }

        refreshing = true;
        currentFields = this.getFields(roots);
        watchedFields = new Set(currentFields);
        messages.forEach((state, field) => {
          if (!watchedFields.has(field) || !this.isVisible(field)) {
            state.subscription.unsubscribe();
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
                    (watchedFields.has(event.field) &&
                      ['valueChanges', 'expressionChanges', 'hidden'].includes(event.type))
                  ) {
                    refresh(source, typeof event === 'string' ? undefined : event.field);
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

          const previous = messages.get(field);
          // Keep unrelated observable messages subscribed so their last translation is not lost.
          if (
            previous?.control === field.formControl &&
            previous.errors === field.formControl.errors &&
            changedSource !== field.formControl.statusChanges &&
            changedField !== field
          ) {
            return;
          }

          previous?.subscription.unsubscribe();
          const state = {
            control: field.formControl,
            errors: field.formControl.errors,
            entries: [] as FormlyValidationMessageEntry[],
            subscription: new Subscription(),
          };
          messages.set(field, state);
          state.subscription.add(
            defer(() => this.getMessages(field)).subscribe({
              next: (entries) => {
                state.entries = entries;
                emit();
              },
              error: (error) => subscriber.error(error),
            }),
          );
        });
        refreshing = false;
        emit();
      };

      subscriber.add(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        messages.forEach((state) => state.subscription.unsubscribe());
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

  private getMessages(field: FormlyFieldConfig): Observable<FormlyValidationMessageEntry[]> {
    const messages: Observable<FormlyValidationMessageEntry>[] = [];
    Object.keys(field.formControl.errors || {}).forEach((error) => {
      const message = getValidationMessage(field, error, this.config);
      if (message) {
        const message$ = isObservable(message) ? message.pipe(startWith(undefined)) : of(message);
        messages.push(message$.pipe(map((message) => ({ field, error, message }))));
      }
    });

    return messages.length === 0 ? of([]) : combineLatest(messages);
  }
}
