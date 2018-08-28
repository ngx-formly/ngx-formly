import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { FormlyConfig, TemplateManipulators } from './formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../components/formly.field.config';
import { getFieldId, isNullOrUndefined, getKeyPath, assignModelValue, isUndefined, clone, removeFieldControl, getFieldValue } from '../utils';

@Injectable({ providedIn: 'root' })
export class FormlyFormBuilder {
  private formId = 0;

  constructor(private formlyConfig: FormlyConfig) {}

  buildForm(formControl: FormGroup | FormArray, fieldGroup: FormlyFieldConfig[] = [], model: any, options: FormlyFormOptions) {
    const fieldTransforms = (options && options.fieldTransform) || this.formlyConfig.extras.fieldTransform;
    (Array.isArray(fieldTransforms) ? fieldTransforms : [fieldTransforms]).forEach(fieldTransform => {
      if (fieldTransform) {
        fieldGroup = fieldTransform(fieldGroup, model, formControl, options);
        if (!fieldGroup) {
          throw new Error('fieldTransform must return an array of fields');
        }
      }
    });

    this._buildForm({ fieldGroup, model, formControl, options });
  }

  private _buildForm(field: FormlyFieldConfigCache) {
    this.getExtensions().forEach(extension => extension.prePopulate && extension.prePopulate(field));
    this.initFieldOptions(field);
    this.getExtensions().forEach(extension => extension.onPopulate && extension.onPopulate(field));
    if (field.key && field.type) {
      const paths = getKeyPath({ key: field.key });
      let rootForm = field.parent.formControl as FormGroup, rootModel = field.fieldGroup ? { [paths[0]]: field.model } : field.model;
      paths.forEach((path, index) => {
        // FormGroup/FormArray only allow string value for path
        const formPath = path.toString();
        // is last item
        if (index === paths.length - 1) {
          this.addFormControl(rootForm, field, rootModel, formPath);
        } else {
          if (!rootModel[path]) {
            rootModel[path] = typeof path === 'string' ? {} : [];
          }
          this.addFormControl(rootForm, { key: formPath, fieldGroup: [], modelOptions: {}, templateOptions: {} }, rootModel, formPath);

          rootForm = <FormGroup> rootForm.get(formPath);
          rootModel = rootModel[path];
        }
      });
    }

    if (field.fieldGroup) {
      if (!field.formControl) {
        field.formControl = field.parent.formControl;
      }

      field.fieldGroup.forEach((f, index) => {
        Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
        Object.defineProperty(f, 'index', { get: () => index, configurable: true });
        this.formId++;
        this._buildForm(f);
      });
    }

    this.getExtensions().forEach(extension => extension.postPopulate && extension.postPopulate(field));
  }

  private getExtensions() {
    return Object.keys(this.formlyConfig.extensions).map(name => this.formlyConfig.extensions[name]);
  }

  private initFieldOptions(field: FormlyFieldConfigCache) {
    const root = <FormlyFieldConfigCache> field.parent;
    if (!root) {
      return;
    }

    Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
    Object.defineProperty(field, 'model', {
      get: () => field.key && field.fieldGroup ? getFieldValue(field) : root.model,
      configurable: true,
    });

    field.id = getFieldId(`formly_${this.formId}`, field, field['index']);
    field.templateOptions = field.templateOptions || {};
    field.modelOptions = field.modelOptions || {};
    field.lifecycle = field.lifecycle || {};
    if (field.type && field.key) {
      field.templateOptions = Object.assign({
        label: '',
        placeholder: '',
        focus: false,
      }, field.templateOptions);
    }

    if (field.template && field.type !== 'formly-template') {
      if (field.type) {
        console.warn(`NgxFormly: passing 'type' property is not allowed when 'template' is set.`);
      }
      field.type = 'formly-template';
    }

    if (field.type) {
      this.formlyConfig.getMergedField(field);
    }
    if (field.key && isUndefined(field.defaultValue) && (field.fieldGroup || field.fieldArray)) {
      field.defaultValue = field.fieldArray ? [] : {};
    }

    if (!isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
      assignModelValue(root.model, field.key, field.defaultValue);
    }

    this.initFieldWrappers(field);
    if (field.fieldArray) {
      this.initFieldArray(field);
    }

    if (!field.type && field.fieldGroup) {
      field.type = 'formly-group';
    }
  }

  private initFieldArray(field: FormlyFieldConfigCache) {
    field.fieldGroup = field.fieldGroup || [];
    if (field.fieldGroup.length > field.model.length) {
      for (let i = field.fieldGroup.length; i >= field.model.length; --i) {
        removeFieldControl(field.formControl as FormArray, i);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < field.model.length; i++) {
      const f = { ...clone(field.fieldArray), key: `${i}` };
      field.fieldGroup.push(f);
    }
  }

  private addFormControl(form: FormGroup | FormArray, field: FormlyFieldConfigCache, model: any, path: string|number) {
    const abstractControlOptions = {
      validators: field._validators,
      asyncValidators: field._asyncValidators,
      updateOn: field.modelOptions.updateOn,
    } as AbstractControlOptions;
    let control: AbstractControl;

    if (field.formControl instanceof AbstractControl || form.get(<string> path)) {
      control = field.formControl || form.get(<string> path);
      if (
        !(isNullOrUndefined(control.value) && isNullOrUndefined(model[path]))
        && control.value !== model[path]
        && control instanceof FormControl
      ) {
        control.patchValue(model[path]);
      }

      if (abstractControlOptions.validators || abstractControlOptions.asyncValidators) {
        if (abstractControlOptions.validators) {
          control.setValidators(abstractControlOptions.validators);
        }
        if (abstractControlOptions.asyncValidators) {
          control.setAsyncValidators(abstractControlOptions.asyncValidators);
        }
        control.updateValueAndValidity();
      }
    } else if ((<any>field).component && (<any>field).component.createControl) {
      control = (<any>field).component.createControl(model[path], field);
    } else if (field.fieldGroup && !field.fieldArray) {
      control = new FormGroup({}, abstractControlOptions);
    } else if (field.fieldArray) {
      control = new FormArray([], abstractControlOptions);
    } else {
      control = new FormControl(model[path], abstractControlOptions);
    }

    if (field.templateOptions.disabled) {
      control.disable();
    }

    // Replace decorated property with a getter that returns the observable.
    // https://github.com/angular-redux/store/blob/master/src/decorators/select.ts#L79-L85
    if (delete field.templateOptions.disabled) {
      Object.defineProperty(field.templateOptions, 'disabled', {
        get: () => !field.formControl.enabled,
        set: (value: boolean) => value ? field.formControl.disable() : field.formControl.enable(),
        enumerable: true,
        configurable: true,
      });
    }

    if (field) {
      field.formControl = control;
    }

    if (form instanceof FormArray) {
      if (form.at(<number> path) !== control) {
        form.setControl(<number> path, control);
      }
    } else {
      if (form.get(<string> path) !== control) {
        form.setControl(<string> path, control);
      }
    }
  }

  private initFieldWrappers(field: FormlyFieldConfig) {
    field.wrappers = field.wrappers || [];
    const fieldTemplateManipulators: TemplateManipulators = {
      preWrapper: [],
      postWrapper: [],
      ...(field.templateOptions.templateManipulators || {}),
    };

    field.wrappers = [
      ...this.formlyConfig.templateManipulators.preWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.preWrapper.map(m => m(field)),
      ...field.wrappers,
      ...this.formlyConfig.templateManipulators.postWrapper.map(m => m(field)),
      ...fieldTemplateManipulators.postWrapper.map(m => m(field)),
    ].filter((el, i, a) => el && i === a.indexOf(el));
  }
}
