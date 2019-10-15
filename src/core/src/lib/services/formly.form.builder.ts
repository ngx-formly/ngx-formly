import { Injectable, ComponentFactoryResolver, Injector, Optional } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { FormlyConfig } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache, FormlyValueChangeEvent } from '../components/formly.field.config';
import { Subject } from 'rxjs';
import { defineHiddenProp, clone, isNullOrUndefined, wrapProperty } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  constructor(
    private config: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private parentForm: FormGroupDirective,
  ) {}

  buildForm(formControl: FormGroup | FormArray, fieldGroup: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    this.buildField({ fieldGroup, model, formControl, options });
  }

  buildField(field: FormlyFieldConfig) {
    if (!this.config.extensions.core) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }

    if (!field.parent) {
      this._setOptions(field);
      field.options.updateInitialValue();
    }

    this._buildField(field);
  }

  private _buildField(field: FormlyFieldConfigCache) {
    this.getExtensions().forEach(extension => extension.prePopulate && extension.prePopulate(field));
    this.getExtensions().forEach(extension => extension.onPopulate && extension.onPopulate(field));

    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this._buildField(f));
    }

    this.getExtensions().forEach(extension => extension.postPopulate && extension.postPopulate(field));
  }

  private getExtensions() {
    return Object.keys(this.config.extensions).map(name => this.config.extensions[name]);
  }

  private _setOptions(field: FormlyFieldConfigCache) {
    field.options = field.options || {};
    field.options.formState = field.options.formState || {};
    field.formControl = field.formControl || new FormGroup({});

    const options = field.options;
    if (!options.showError) {
      options.showError = this.config.extras.showError;
    }

    if (!options.updateInitialValue) {
      options.updateInitialValue = () => options._initialModel = clone(field.model);
    }

    if (!options.fieldChanges) {
      defineHiddenProp(options, 'fieldChanges', new Subject<FormlyValueChangeEvent>());
    }

    if (!options._componentFactoryResolver) {
      defineHiddenProp(options, '_componentFactoryResolver', this.componentFactoryResolver);
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

    if (!options.resetModel) {
      options.resetModel = (model ?: any) => {
        model = clone(isNullOrUndefined(model) ? options._initialModel : model);
        if (field.model) {
          Object.keys(field.model).forEach(k => delete field.model[k]);
          Object.assign(field.model, model || {});
        }

        options._buildField(field);

        // we should call `NgForm::resetForm` to ensure changing `submitted` state after resetting form
        // but only when the current component is a root one.
        if (options.parentForm && options.parentForm.control === field.formControl) {
          options.parentForm.resetForm(model);
        } else {
          field.formControl.reset(model);
        }
      };
    }

    if (!options._buildField) {
      options._buildForm = () => console.warn(`Formly: use 'options._buildField' instead of 'options._buildForm'.`);
      options._buildField = (f: FormlyFieldConfig) => this.buildField(f);
    }

    if (!(<any> options).buildForm) {
      (<any> options).buildForm = () => {
        console.warn(`Formly: 'buildForm' is deprecated since v5.0, use 'buildField' instead.`);
        this.buildField(field);
      };
    }

    if (!options.parentForm && this.parentForm) {
      defineHiddenProp(options, 'parentForm', this.parentForm);
      wrapProperty(options.parentForm, 'submitted', ({ firstChange }) => {
        if (firstChange) {
          options._markForCheck(field);
        }
      });
    }
  }
}
