import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

interface ISelectOption {
  label: string;
  disabled?: boolean;
  value?: any;
  group?: ISelectOption[];
}

type ITransformOption = Partial<{
  labelProp: (option: any) => string;
  valueProp: (option: any) => any;
  disabledProp: (option: any) => boolean;
  groupProp: (option: any) => string;
}>;

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform {
  transform(options: any, field?: FormlyFieldConfig): Observable<ISelectOption[]> {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }

    const to = this.transformSelectProps(field);
    return (options as Observable<any>).pipe(
      map(value => this.transformOptions(value, to)),
    );
  }

  private transformOptions(options: any[], to: ITransformOption): ISelectOption[] {
    const opts: ISelectOption[] = [];
    const groups = {};

    options.forEach(option => {
      const o = this.transformOption(option, to);
      if (o.group) {
        const id = groups[o.label];
        if (id === undefined) {
          groups[o.label] = opts.push(o) - 1;
        } else {
          o.group.forEach(o => opts[id].group.push(o));
        }
      } else {
        opts.push(o);
      }
    });

    return opts;
  }

  private transformOption(option: any, to: ITransformOption): ISelectOption {
    const group = to.groupProp(option);

    option = {
      label: to.labelProp(option),
      value: to.valueProp(option),
      disabled: !!to.disabledProp(option),
    };

    if (group) {
      return { label: group, group: [option] };
    }

    return option;
  }

  private transformSelectProps(field: FormlyFieldConfig): ITransformOption {
    const to = field && field.templateOptions ? field.templateOptions : {};
    const selectPropFn = (prop: any) => typeof prop === 'function'
      ? prop
      : o => o[prop];

    return {
      groupProp: selectPropFn(to.groupProp || 'group'),
      labelProp: selectPropFn(to.labelProp || 'label'),
      valueProp: selectPropFn(to.valueProp || 'value'),
      disabledProp: selectPropFn(to.disabledProp || 'disabled'),
    };
  }
}
