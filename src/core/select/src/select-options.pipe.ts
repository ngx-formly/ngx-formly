import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Pipe({ name: 'formlySelectOptions' })
export class FormlySelectOptionsPipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription;
  private _options: BehaviorSubject<any[]>;

  transform(options, field?: FormlyFieldConfig) {
    if (!(options instanceof Observable)) {
      options = this.observableOf(options, field);
    } else {
      this.dispose();
    }

    return (options as Observable<any>).pipe(
      map(value => this.toOptions(value, field || {})),
    );
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private toOptions(options, field: FormlyFieldConfig) {
    const gOptions: any[] = [],
      groups: { [key: string]: any[] } = {},
      to = field.templateOptions || {};

    to._flatOptions = true;
    options.map((option: any) => {
      if (!this.getGroupProp(option, to)) {
        gOptions.push(this.toOption(option, to));
      } else {
        to._flatOptions = false;
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
      disabled: this.getDisabledProp(item, to) || false,
    };
  }

  private getLabelProp(item, to): string {
    if (typeof to.labelProp === 'function') {
      return to.labelProp(item);
    }

    if (this.shouldUseLegacyOption(item, to)) {
      console.warn(`NgxFormly: legacy select option '{key, value}' is deprecated since v5.5, use '{value, label}' instead.`);
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

  private getDisabledProp(item, to): string {
    if (typeof to.disabledProp === 'function') {
      return to.disabledProp(item);
    }
    return item[to.disabledProp || 'disabled'];
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

  private observableOf(options, f?: FormlyFieldConfig) {
    this.dispose();
    if (f && f.options && f.options.fieldChanges) {
      this._subscription = f.options.fieldChanges.pipe(
        filter(({ property, type, field }) => {
          return type === 'expressionChanges'
            && property.indexOf('templateOptions.options') === 0
            && field === f
            && Array.isArray(field.templateOptions.options)
            && !!this._options;
        }),
        tap(() => this._options.next(f.templateOptions.options as any)),
      ).subscribe();
    }

    this._options = new BehaviorSubject(options);
    return this._options.asObservable();
  }
}
