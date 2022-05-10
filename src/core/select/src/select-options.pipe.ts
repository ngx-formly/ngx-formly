import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FormlySelectOption {
  label: string;
  disabled?: boolean;
  value?: any;
  group?: FormlySelectOption[];
}

type ITransformOption = {
  labelProp: (option: any) => string;
  valueProp: (option: any) => any;
  disabledProp: (option: any) => boolean;
  groupProp: (option: any) => string;
};

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform {
  transform(options: any, field?: FormlyFieldConfig): Observable<FormlySelectOption[]> {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }

    return (options as Observable<any>).pipe(map((value) => this.transformOptions(value, field)));
  }

  private transformOptions(options: any[], field?: FormlyFieldConfig): FormlySelectOption[] {
    const to = this.transformSelectProps(field);

    const opts: FormlySelectOption[] = [];
    const groups: { [id: string]: number } = {};

    options.forEach((option) => {
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

    if (field?.props) {
      field.props._flatOptions = !Object.keys(groups).length;
    }

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
}
