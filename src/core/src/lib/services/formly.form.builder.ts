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
    if (!this.formlyConfig.extensions.core) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }

    this._buildForm({ fieldGroup, model, formControl, options: this._setOptions(options) });
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

  private _setOptions(options: FormlyFormOptionsCache) {
    options = options || {};
    options.formState = options.formState || {};

    if (!options.showError) {
      options.showError = this.formlyConfig.extras.showError;
    }

    if (!options.fieldChanges) {
      defineHiddenProp(options, 'fieldChanges', new Subject<FormlyValueChangeEvent>());
    }

    if (!options._resolver) {
      defineHiddenProp(options, '_resolver', this.componentFactoryResolver);
    }

    if (!options._injector) {
      defineHiddenProp(options, '_injector', this.injector);
    }

    if (!options._hiddenFieldsForCheck) {
      options._hiddenFieldsForCheck = [];
    }

    if (!options._markForCheck) {
      options._markForCheck = (field) => {
        if (field._componentRefs) {
          field._componentRefs.forEach(ref => ref.changeDetectorRef.markForCheck());
        }

        if (field.fieldGroup) {
          field.fieldGroup.forEach(f => options._markForCheck(f));
        }
      };
    }

    return options;
  }
}
