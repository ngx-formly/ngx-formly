import { ChangeDetectorRef, ComponentRef } from '@angular/core';
import { FormlyConfig } from '../../services/formly.config';
import { FormlyFieldConfigCache, FormlyValueChangeEvent, FormlyExtension } from '../../models';
import {
  getFieldId,
  assignFieldValue,
  isUndefined,
  getFieldValue,
  reverseDeepMerge,
  defineHiddenProp,
  clone,
  isNil,
} from '../../utils';
import { Subject } from 'rxjs';

/** @experimental */
export class CoreExtension implements FormlyExtension {
  private formId = 0;
  constructor(private config: FormlyConfig) {}

  prePopulate(field: FormlyFieldConfigCache) {
    const root = field.parent;
    this.initRootOptions(field);
    if (root) {
      Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
      Object.defineProperty(field, 'model', {
        get: () => (!isNil(field.key) && field.fieldGroup ? getFieldValue(field) : root.model),
        configurable: true,
      });
    }

    this.getFieldComponentInstance(field).prePopulate();
  }

  onPopulate(field: FormlyFieldConfigCache) {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field).onPopulate();
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
    this.getFieldComponentInstance(field).postPopulate();
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
        f.options.checkExpressions(f.parent ?? f);
        f._componentRefs.forEach((ref) => {
          // NOTE: we cannot use ref.changeDetectorRef, see https://github.com/ngx-formly/ngx-formly/issues/2191
          if (ref instanceof ComponentRef) {
            const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
            changeDetectorRef.markForCheck();
          } else {
            ref.markForCheck();
          }
        });
      }

      if (f.fieldGroup) {
        f.fieldGroup.forEach((f) => f && options.detectChanges(f));
      }
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
      id: getFieldId(`formly_${this.formId}`, field, field['index']),
      hooks: {},
      modelOptions: {},
      templateOptions:
        !field.type || isNil(field.key)
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
      (field.template || (field.expressionProperties && field.expressionProperties.template))
    ) {
      field.type = 'formly-template';
    }

    if (!field.type && field.fieldGroup) {
      field.type = 'formly-group';
    }

    if (field.type) {
      this.config.getMergedField(field);
    }

    if (!isNil(field.key) && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
      let setDefaultValue = !field.resetOnHide || !(field.hide || field.hideExpression);
      if (setDefaultValue && field.resetOnHide) {
        let parent = field.parent;
        while (parent && !parent.hideExpression && !parent.hide) {
          parent = parent.parent;
        }
        setDefaultValue = !parent || !(parent.hideExpression || parent.hide);
      }

      if (setDefaultValue) {
        assignFieldValue(field, field.defaultValue);
      }
    }

    field.wrappers = field.wrappers || [];
  }

  private getFieldComponentInstance(field: FormlyFieldConfigCache) {
    const componentRef = this.config.resolveFieldTypeRef(field);
    const instance = componentRef?.instance as FormlyExtension;

    return {
      prePopulate: () => instance?.prePopulate?.(field),
      onPopulate: () => instance?.onPopulate?.(field),
      postPopulate: () => instance?.postPopulate?.(field),
    };
  }
}
