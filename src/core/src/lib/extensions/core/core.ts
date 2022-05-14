import { ComponentRef } from '@angular/core';
import { FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache, FormlyValueChangeEvent, FormlyExtension, FormlyFieldConfig } from '../../models';
import {
  getFieldId,
  assignFieldValue,
  isUndefined,
  getFieldValue,
  reverseDeepMerge,
  defineHiddenProp,
  clone,
  getField,
  markFieldForCheck,
  hasKey,
} from '../../utils';
import { Subject } from 'rxjs';

export class CoreExtension implements FormlyExtension {
  private formId = 0;
  constructor(private config: FormlyConfig) {}

  prePopulate(field: FormlyFieldConfigCache) {
    const root = field.parent;
    this.initRootOptions(field);
    this.initFieldProps(field);
    if (root) {
      Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
      Object.defineProperty(field, 'model', {
        get: () => (hasKey(field) && field.fieldGroup ? getFieldValue(field) : root.model),
        configurable: true,
      });
    }

    Object.defineProperty(field, 'get', {
      value: (key: FormlyFieldConfig['key']) => getField(field, key),
      configurable: true,
    });

    this.getFieldComponentInstance(field).prePopulate?.(field);
  }

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field).onPopulate?.(field);
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f, index) => {
        if (f) {
          Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
          Object.defineProperty(f, 'index', { get: () => index, configurable: true });
        }
        this.formId++;
      });
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    this.getFieldComponentInstance(field).postPopulate?.(field);
  }

  private initFieldProps(field: FormlyFieldConfigCache) {
    field.props ??= field.templateOptions;
    Object.defineProperty(field, 'templateOptions', {
      get: () => field.props,
      set: (props) => (field.props = props),
      configurable: true,
    });
  }

  private initRootOptions(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const options = field.options;
    field.options.formState = field.options.formState || {};
    if (!options.showError) {
      options.showError = this.config.extras.showError;
    }

    if (!options.fieldChanges) {
      defineHiddenProp(options, 'fieldChanges', new Subject<FormlyValueChangeEvent>());
    }

    if (!options._hiddenFieldsForCheck) {
      options._hiddenFieldsForCheck = [];
    }

    options._markForCheck = (f) => {
      console.warn(`Formly: 'options._markForCheck' is deprecated since v6.0, use 'options.detectChanges' instead.`);
      options.detectChanges(f);
    };

    options.detectChanges = (f: FormlyFieldConfigCache) => {
      if (f._componentRefs) {
        f.options.checkExpressions(f);
        markFieldForCheck(f);
      }

      f.fieldGroup?.forEach((f) => f && options.detectChanges(f));
    };

    options.resetModel = (model?: any) => {
      model = clone(model ?? options._initialModel);
      if (field.model) {
        Object.keys(field.model).forEach((k) => delete field.model[k]);
        Object.assign(field.model, model || {});
      }

      options.build(field);
      field.form.reset(field.model);
      if (options.parentForm && options.parentForm.control === field.formControl) {
        (options.parentForm as { submitted: boolean }).submitted = false;
      }
    };

    options.updateInitialValue = (model?: any) => (options._initialModel = clone(model ?? field.model));
    field.options.updateInitialValue();
  }

  private initFieldOptions(field: FormlyFieldConfigCache) {
    reverseDeepMerge(field, {
      id: getFieldId(`formly_${this.formId}`, field, field.index),
      hooks: {},
      modelOptions: {},
      validation: { messages: {} },
      props:
        !field.type || !hasKey(field)
          ? {}
          : {
              label: '',
              placeholder: '',
              disabled: false,
            },
    });

    if (this.config.extras.resetFieldOnHide && field.resetOnHide !== false) {
      field.resetOnHide = true;
    }

    if (
      field.type !== 'formly-template' &&
      (field.template || field.expressions?.template || field.expressionProperties?.template)
    ) {
      field.type = 'formly-template';
    }

    if (!field.type && field.fieldGroup) {
      field.type = 'formly-group';
    }

    if (field.type) {
      this.config.getMergedField(field);
    }

    if (hasKey(field) && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
      const isHidden = (f: FormlyFieldConfig) => f.hide || f.expressions?.hide || f.hideExpression;
      let setDefaultValue = !field.resetOnHide || !isHidden(field);
      if (!isHidden(field) && field.resetOnHide) {
        let parent = field.parent;
        while (parent && !isHidden(parent)) {
          parent = parent.parent;
        }
        setDefaultValue = !parent || !isHidden(parent);
      }

      if (setDefaultValue) {
        assignFieldValue(field, field.defaultValue);
      }
    }

    field.wrappers = field.wrappers || [];
  }

  private getFieldComponentInstance(field: FormlyFieldConfigCache) {
    const componentRefInstance = () => {
      let componentRef = this.config.resolveFieldTypeRef(field);

      const fieldComponentRef = field._componentRefs?.slice(-1)[0];
      if (
        fieldComponentRef instanceof ComponentRef &&
        fieldComponentRef?.componentType === componentRef?.componentType
      ) {
        componentRef = fieldComponentRef as any;
      }

      return componentRef?.instance as any;
    };

    if (!field._proxyInstance) {
      defineHiddenProp(
        field,
        '_proxyInstance',
        new Proxy({} as FormlyExtension, {
          get: (_, prop) => componentRefInstance()?.[prop],
          set: (_, prop, value) => (componentRefInstance()[prop] = value),
        }),
      );
    }

    return field._proxyInstance;
  }
}
