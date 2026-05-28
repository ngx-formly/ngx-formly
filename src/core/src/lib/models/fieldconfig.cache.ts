import { ComponentRef, ElementRef, EmbeddedViewRef, Injector, ViewContainerRef } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, UntypedFormArray, UntypedFormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FieldType } from '../templates/field.type';
import { FormlyExtension } from './config';
import { FormlyFieldConfig, FormlyFormOptions } from './fieldconfig';

export interface FormlyFieldConfigCache extends FormlyFieldConfig {
  form?: UntypedFormGroup | UntypedFormArray;
  model?: any;
  formControl?: AbstractControl & {
    _fields?: FormlyFieldConfigCache[];
    _childrenErrors?: { [id: string]: () => void };
  };
  parent?: FormlyFieldConfigCache;
  options?: FormlyFormOptionsCache;
  shareFormControl?: boolean;
  index?: number;
  _localFields?: FormlyFieldConfigCache[];
  _elementRefs?: ElementRef[];
  _expressions?: {
    [property: string]: {
      callback?: (ingoreCache: boolean) => boolean;
      paths?: string[];
      subscription?: Subscription | null;
      value$?: Observable<any>;
    };
  };
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
  _hiddenFieldsForCheck?: { field: FormlyFieldConfigCache; default?: boolean }[];
  _initialModel?: any;
  _detectChanges?: (field: FormlyFieldConfig) => void;
}
