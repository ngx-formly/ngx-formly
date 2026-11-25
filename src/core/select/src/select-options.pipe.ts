import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs';
import { filter, map, scan, tap } from 'rxjs/operators';
import {
  FormlyFieldConfig,
  FormlyFieldProps,
  FormlyFormOptions,
  ɵdefineHiddenProp as defineHiddenProp,
} from '@ngx-formly/core';

/* eslint-disable @typescript-eslint/no-explicit-any -- Public option callbacks must accept consumer-defined value shapes. */
export interface FormlySelectOption {
  label: string;
  disabled?: boolean;
  value?: any;
  group?: FormlySelectOption[];
}

export interface FormlyFieldSelectProps extends FormlyFieldProps {
  groupProp?: string | ((option: any) => string);
  labelProp?: string | ((option: any) => string);
  valueProp?: string | ((option: any) => any);
  disabledProp?: string | ((option: any) => boolean);
  mapProp?: (option: any) => FormlySelectOption;
}

type ITransformOption = {
  labelProp: (option: any) => string;
  valueProp: (option: any) => any;
  disabledProp: (option: any) => boolean;
  groupProp: (option: any) => string;
  mapProp?: (option: any) => FormlySelectOption;
};

/* eslint-enable @typescript-eslint/no-explicit-any */

const optionSources = new WeakMap<FormlySelectOption[], readonly unknown[]>();

@Pipe({ name: 'formlySelectOptions', standalone: true })
export class FormlySelectOptionsPipe implements PipeTransform, OnDestroy {
  /** @internal Source rows for adapters that track custom-mapped choices across rebuilds. */
  static ɵgetOptionSources(options: FormlySelectOption[]): readonly unknown[] {
    return optionSources.get(options) ?? options;
  }

  private _subscription: Subscription;
  private _options: BehaviorSubject<unknown[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Option mappings retain the consumer-defined values accepted by the public select API.
  transform(options: any, field?: FormlyFieldConfig): Observable<FormlySelectOption[]> {
    if (isObservable(options)) {
      this.dispose();
      return (options as Observable<unknown[]>).pipe(map((value) => this.transformOptions(value, field)));
    }

    return this.observableOf(options, field).pipe(
      scan((previous, value) => {
        const mapped = this.transformOptions(value, field);
        // Custom mappers own their option objects and may use their identity.
        if ((field?.props || field?.templateOptions)?.mapProp) {
          // Read the rows the same way `transformOptions` does, so any iterable with `forEach` (Set, Map) works.
          const sources: unknown[] = [];
          value?.forEach((option) => sources.push(option));
          optionSources.set(
            mapped,
            new Set(sources).size === sources.length ? sources.slice() : sources.map((_, i) => i),
          );
          return mapped;
        }
        return mapped.map((option, i) => (sameOption(previous[i], option) ? previous[i] : option));
      }, [] as FormlySelectOption[]),
    );
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private transformOptions(options: unknown[], field?: FormlyFieldConfig): FormlySelectOption[] {
    const to = this.transformSelectProps(field);

    const opts: FormlySelectOption[] = [];
    const groups: { [id: string]: number } = {};

    options?.forEach((option) => {
      if (to.mapProp) {
        const mapped = to.mapProp(option);
        opts.push(mapped);
      } else {
        const o = this.transformOption(option, to);
        if (o.group) {
          const id = groups[o.label];
          if (id === undefined) {
            groups[o.label] = opts.push(o) - 1;
          } else {
            o.group.forEach((o) => opts[id].group.push(o));
          }
        } else {
          opts.push(o);
        }
      }
    });

    return opts;
  }

  private transformOption(option: unknown, props: ITransformOption): FormlySelectOption {
    const group = props.groupProp(option);
    if (Array.isArray(group)) {
      return {
        label: props.labelProp(option),
        group: group.map((opt) => this.transformOption(opt, props)),
      };
    }

    const result = {
      label: props.labelProp(option),
      value: props.valueProp(option),
      disabled: !!props.disabledProp(option),
    };

    if (group) {
      return { label: group, group: [result] };
    }

    return result;
  }

  private transformSelectProps(field?: FormlyFieldConfig): ITransformOption {
    const props = field?.props || field?.templateOptions || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Option mappings retain the consumer-defined values accepted by the public select API.
    const selectPropFn = (prop: any) => (typeof prop === 'function' ? prop : (o: any) => o[prop]);

    return {
      groupProp: selectPropFn(props.groupProp || 'group'),
      labelProp: selectPropFn(props.labelProp || 'label'),
      valueProp: selectPropFn(props.valueProp || 'value'),
      disabledProp: selectPropFn(props.disabledProp || 'disabled'),
      mapProp: props.mapProp,
    };
  }

  private dispose() {
    if (this._options) {
      this._options.complete();
      this._options = null;
    }

    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  private observableOf(options: unknown[], f?: FormlyFieldConfig) {
    this.dispose();
    if (f && f.options && f.options.fieldChanges) {
      const formOptions = f.options as FormlyFormOptions & { _afterBuild?: Set<() => void> };
      const usesFieldOptions = options === f.props?.options;
      const refresh = () => {
        const current = usesFieldOptions ? f.props?.options : options;
        if (Array.isArray(current)) {
          this._options.next(current);
        }
      };
      this._subscription = formOptions.fieldChanges
        .pipe(
          filter(({ property, type, field }) => {
            return (
              type === 'expressionChanges' &&
              (property.indexOf('templateOptions.options') === 0 || property.indexOf('props.options') === 0) &&
              field === f &&
              // During a build the after-build callback refreshes the final options.
              !('_formControlsForCheck' in formOptions) &&
              !!this._options
            );
          }),
          tap(refresh),
        )
        .subscribe();

      if (!formOptions._afterBuild) {
        defineHiddenProp(formOptions, '_afterBuild', new Set());
      }
      // Mapping callbacks and mutable option values can change without an expression event.
      formOptions._afterBuild.add(refresh);
      this._subscription.add(() => formOptions._afterBuild.delete(refresh));
    }

    this._options = new BehaviorSubject(options);
    return this._options.asObservable();
  }
}

// Keep generated option identities stable for templates that track the mapped object.
function sameOption(previous: FormlySelectOption, next: FormlySelectOption): boolean {
  return (
    !!previous &&
    previous.label === next.label &&
    previous.disabled === next.disabled &&
    Object.is(previous.value, next.value) &&
    (previous.group === next.group ||
      (previous.group?.length === next.group?.length &&
        previous.group.every((option, i) => sameOption(option, next.group[i]))))
  );
}

@Pipe({ name: 'formlySelectOptions', standalone: false })
export class LegacyFormlySelectOptionsPipe extends FormlySelectOptionsPipe implements PipeTransform, OnDestroy {}
