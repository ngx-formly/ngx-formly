import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';

export interface FormlySelectOption {
  label: string;
  disabled?: boolean;
  value?: any;
  group?: FormlySelectOption[];
}

export interface FormlyFieldSelectProps extends FormlyFieldProps {
  groupProp?: string | ((option: any) => string);
  labelProp?: string | ((option: any) => any);
  valueProp?: string | ((option: any) => boolean);
  disabledProp?: string | ((option: any) => string);
}

type ITransformOption = {
  labelProp: (option: any) => string;
  valueProp: (option: any) => any;
  disabledProp: (option: any) => boolean;
  groupProp: (option: any) => string;
};

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription;
  private _options: BehaviorSubject<any[]>;

  transform(options: any, field?: FormlyFieldConfig): Observable<FormlySelectOption[]> {
    if (!(options instanceof Observable)) {
      options = this.observableOf(options, field);
    } else {
      this.dispose();
    }

    return (options as Observable<any>).pipe(map((value) => this.transformOptions(value, field)));
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private transformOptions(options: any[], field?: FormlyFieldConfig): FormlySelectOption[] {
    const to = this.transformSelectProps(field);

    const opts: FormlySelectOption[] = [];
    const groups: { [id: string]: number } = {};

    options?.forEach((option) => {
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
    });

    return opts;
  }

  private transformOption(option: any, props: ITransformOption): FormlySelectOption {
    const group = props.groupProp(option);
    if (Array.isArray(group)) {
      return {
        label: props.labelProp(option),
        group: group.map((opt) => this.transformOption(opt, props)),
      };
    }

    option = {
      label: props.labelProp(option),
      value: props.valueProp(option),
      disabled: !!props.disabledProp(option),
    };

    if (group) {
      return { label: group, group: [option] };
    }

    return option;
  }

  private transformSelectProps(field?: FormlyFieldConfig): ITransformOption {
    const props = field?.props || field?.templateOptions || {};
    const selectPropFn = (prop: any) => (typeof prop === 'function' ? prop : (o: any) => o[prop]);

    return {
      groupProp: selectPropFn(props.groupProp || 'group'),
      labelProp: selectPropFn(props.labelProp || 'label'),
      valueProp: selectPropFn(props.valueProp || 'value'),
      disabledProp: selectPropFn(props.disabledProp || 'disabled'),
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

  private observableOf(options: any, f?: FormlyFieldConfig) {
    this.dispose();
    if (f && f.options && f.options.fieldChanges) {
      this._subscription = f.options.fieldChanges
        .pipe(
          filter(({ property, type, field }) => {
            return (
              type === 'expressionChanges' &&
              (property.indexOf('templateOptions.options') === 0 || property.indexOf('props.options') === 0) &&
              field === f &&
              Array.isArray(field.props.options) &&
              !!this._options
            );
          }),
          tap(() => this._options.next(f.props.options as any)),
        )
        .subscribe();
    }

    this._options = new BehaviorSubject(options);
    return this._options.asObservable();
  }
}
