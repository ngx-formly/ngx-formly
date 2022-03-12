import {
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';
import { FormlyExtension } from './config';
import { FormlyFieldConfig, FormlyFormOptions } from './fieldconfig';

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  form?: FormGroup | FormArray;
  model?: any;
  formControl?: AbstractControl & { _fields?: FormlyFieldConfigCache[]; _childrenErrors?: { [id: string]: Function } };
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  shareFormControl?: boolean;
  index?: number;
  _elementRefs?: ElementRef[];
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: (ComponentRef<FieldType> | EmbeddedViewRef<FieldType>)[];
  _proxyInstance?: FormlyExtension;
  _keyPath?: {
    key: FormlyFieldConfig['key'];
    path: string[];
  };
}

export interface FormlyFormOptionsCache extends FormlyFormOptions {
  checkExpressions?: (field: FormlyFieldConfig, ingoreCache?: boolean) => void;
  _viewContainerRef?: ViewContainerRef;
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
