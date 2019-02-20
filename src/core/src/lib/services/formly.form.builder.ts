import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache, FormlyValueChangeEvent, FormlyFormOptionsCache } from '../components/formly.field.config';
import { Subject } from 'rxjs';
import { defineHiddenProp } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  constructor(
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  buildForm(formControl: FormGroup | FormArray, fieldGroup: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    options = options || {};
    options.formState = options.formState || {};

    if (!options.showError) {
      options.showError = this.formlyConfig.extras.showError;
    }

    if (!options.fieldChanges) {
      defineHiddenProp(options, 'fieldChanges', new Subject<FormlyValueChangeEvent>());
    }

    if (!(<FormlyFormOptionsCache> options)._componentFactoryResolver) {
      defineHiddenProp(options, '_componentFactoryResolver', this.componentFactoryResolver);
    }

    if (!(<FormlyFormOptionsCache> options)._injector) {
      defineHiddenProp(options, '_injector', this.injector);
    }

    this._buildForm({ fieldGroup, model, formControl, options });
  }

  private _buildForm(field: FormlyFieldConfigCache) {
    this.getExtensions().forEach(extension => extension.prePopulate && extension.prePopulate(field));
    this.getExtensions().forEach(extension => extension.onPopulate && extension.onPopulate(field));

    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this._buildForm(f));
    }

    this.getExtensions().forEach(extension => extension.postPopulate && extension.postPopulate(field));
  }

  private getExtensions() {
    return Object.keys(this.formlyConfig.extensions).map(name => this.formlyConfig.extensions[name]);
  }
}
