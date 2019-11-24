import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig, FormlyFormOptions } from './fieldconfig';

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: ComponentRef<FieldType>[];
  _keyPath?: {
    key: string;
    path: string[];
  };
}

export interface FormlyFormOptionsCache extends FormlyFormOptions {
  _checkField?: (field: FormlyFieldConfigCache, ignoreCache?: boolean) => void;
  _markForCheck?: (field: FormlyFieldConfigCache) => void;
  _buildForm?: () => void;
  _buildField?: (field: FormlyFieldConfig) => void;
  _resolver?: ComponentFactoryResolver;
  _injector?: Injector;
  _hiddenFieldsForCheck?: FormlyFieldConfigCache[];
  _initialModel?: any;
}
