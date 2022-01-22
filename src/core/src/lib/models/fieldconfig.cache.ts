import { ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig, FormlyFormOptions } from './fieldconfig';

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  form?: FormGroup | FormArray;
  model?: any;
  formControl?: AbstractControl;
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: (ComponentRef<FieldType> | EmbeddedViewRef<FieldType>)[];
  _proxyInstance?: any;
  _keyPath?: {
    key: FormlyFieldConfig['key'];
    path: string[];
  };
}

export interface FormlyFormOptionsCache extends FormlyFormOptions {
  checkExpressions?: (field: FormlyFieldConfig, ingoreCache?: boolean) => void;
  _resolver?: ComponentFactoryResolver;
  _injector?: Injector;
  _hiddenFieldsForCheck?: FormlyFieldConfigCache[];
  _initialModel?: any;

  /** @deprecated */
  _buildForm?: () => void;

  /** @deprecated */
  _checkField?: (field: FormlyFieldConfig, ingoreCache?: boolean) => void;

  /** @deprecated */
  _markForCheck?: (field: FormlyFieldConfig) => void;
}
