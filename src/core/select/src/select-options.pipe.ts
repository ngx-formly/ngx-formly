import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform {
  transform(options, field?: FormlyFieldConfig) {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }

    return (options as Observable<any>).pipe(
      map(value => this.toOptions(value, field || {})),
    );
  }

  private toOptions(options, field: FormlyFieldConfig) {
    const gOptions: any[] = [],
      groups: { [key: string]: any[] } = {},
      to = field.templateOptions || {};

    options.map((option: any) => {
      if (!this.getGroupProp(option, to)) {
        gOptions.push(this.toOption(option, to));
      } else {
        if (!groups[this.getGroupProp(option, to)]) {
          groups[this.getGroupProp(option, to)] = [];
          gOptions.push({
            label: this.getGroupProp(option, to),
            group: groups[this.getGroupProp(option, to)],
          });
        }
        groups[this.getGroupProp(option, to)].push(this.toOption(option, to));
      }
    });

    return gOptions;
  }

  private toOption(item, to) {
    return {
      label: this.getLabelProp(item, to),
      value: this.getValueProp(item, to),
    };
  }

  private getLabelProp(item, to): string {
    if (typeof to.labelProp === 'function') {
      return to.labelProp(item);
    }

    if (this.shouldUseLegacyOption(item, to)) {
      return item.value;
    }

    return item[to.labelProp || 'label'];
  }

  private getValueProp(item, to): string {
    if (typeof to.valueProp === 'function') {
      return to.valueProp(item);
    }

    if (this.shouldUseLegacyOption(item, to)) {
      return item.key;
    }

    return item[to.valueProp || 'value'];
  }

  private getGroupProp(item, to): string {
    if (typeof to.groupProp === 'function') {
      return to.groupProp(item);
    }

    return item[to.groupProp || 'group'];
  }

  private shouldUseLegacyOption(item, to) {
    return !to.valueProp
      && !to.labelProp
      && item != null
      && typeof item === 'object'
      && 'key' in item
      && 'value' in item;
  }
}
