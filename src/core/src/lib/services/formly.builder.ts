import { Injectable, ComponentFactoryResolver, Injector, Optional } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../models';
import { defineHiddenProp, observe } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  constructor(
    private config: FormlyConfig,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private parentForm: FormGroupDirective,
  ) {}

  buildForm(form: FormGroup | FormArray, fieldGroup: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this.build({ fieldGroup, model, form, options });
  }

  build(field: FormlyFieldConfig) {
    if (!this.config.extensions.core) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }

    if (!field.parent) {
      this._setOptions(field);
      this._build(field);
      const options = (field as FormlyFieldConfigCache).options;
      options.checkExpressions?.(field, true);
      options.detectChanges?.(field);
    } else {
      this._build(field);
    }
  }

  private _build(field: FormlyFieldConfigCache) {
    if (!field) {
      return;
    }

    this.getExtensions().forEach((extension) => extension.prePopulate?.(field));
    this.getExtensions().forEach((extension) => extension.onPopulate?.(field));

    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this._build(f));
    }

    this.getExtensions().forEach((extension) => extension.postPopulate?.(field));
  }

  private getExtensions() {
    return Object.keys(this.config.extensions).map((name) => this.config.extensions[name]);
  }

  private _setOptions(field: FormlyFieldConfigCache) {
    field.form = field.form || new FormGroup({});
    field.model = field.model || {};
    field.options = field.options || {};
    const options = field.options;

    if (!options._resolver) {
      defineHiddenProp(options, '_resolver', this.resolver);
    }

    if (!options._injector) {
      defineHiddenProp(options, '_injector', this.injector);
    }

    if (!options.build) {
      options._buildForm = () => {
        console.warn(`Formly: 'options._buildForm' is deprecated since v6.0, use 'options.build' instead.`);
        this.build(field);
      };

      options.build = (f: FormlyFieldConfig = field) => {
        this.build(f);

        return f;
      };
    }

    if (!options.parentForm && this.parentForm) {
      defineHiddenProp(options, 'parentForm', this.parentForm);
      observe(options, ['parentForm', 'submitted'], ({ firstChange }) => {
        if (!firstChange) {
          options.checkExpressions(field);
          options.detectChanges(field);
        }
      });
    }
  }
}
