import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig, FormlyFormOptions } from './fieldconfig';

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  form?: FormGroup | FormArray;
  model?: any;
  formControl?: AbstractControl;
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  resetOnHide?: boolean;
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: ComponentRef<FieldType>[];
  _keyPath?: {
    key: FormlyFieldConfig['key'];
    path: string[];
  };
}

export interface FormlyFormOptionsCache extends FormlyFormOptions {
  _checkField?: (field: FormlyFieldConfigCache, ignoreCache?: boolean) => void;
  _markForCheck?: (field: FormlyFieldConfigCache) => void;
  _buildForm?: () => void;
  _buildField?: (field: FormlyFieldConfigCache) => FormlyFieldConfigCache;
  _resolver?: ComponentFactoryResolver;
  _injector?: Injector;
  _hiddenFieldsForCheck?: FormlyFieldConfigCache[];
  _initialModel?: any;
}
