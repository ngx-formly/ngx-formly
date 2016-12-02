import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormlyValueChangeEvent } from './../services/formly.event.emitter';
import { FormlyFieldConfig } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { assignModelValue, isNullOrUndefined, isObject, reverseDeepMerge, getKey, getValueForKey, getFieldModel } from '../utils';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let field of fields"
      [hide]="field.hideExpression" [model]="fieldModel(field)"
      [form]="form" [field]="field" (modelChange)="changeModel($event)"
      [ngClass]="!field.fieldGroup ? field.className: undefined"
      [options]="options">
    </formly-field>
    <ng-content></ng-content>
  `,
})
export class FormlyForm implements OnChanges {
  @Input() model: any = {};
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() options: any;
  private initialModel: any;

  constructor(private formlyBuilder: FormlyFormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      this.model = this.model || {};
      this.form = this.form || (new FormGroup({}));
      this.setOptions();
      this.formlyBuilder.buildForm(this.form, this.fields, this.model, this.options);
      this.updateInitialValue();
    } else if (changes['model'] && this.fields && this.fields.length > 0) {
      this.form.patchValue(this.model);
    }
  }

  fieldModel(field: FormlyFieldConfig) {
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      return getFieldModel(this.model, field, true);
    }
    return this.model;
  }

  changeModel(event: FormlyValueChangeEvent) {
    assignModelValue(this.model, event.key, event.value);
  }

  setOptions() {
    this.options = this.options || {};
    this.options.resetModel = this.resetModel.bind(this);
    this.options.updateInitialValue = this.updateInitialValue.bind(this);
  }

  private resetModel(model?: any) {
    model = isNullOrUndefined(model) ? this.initialModel : model;
    this.form.patchValue(model);
    this.resetFormGroup(model, this.form);
    this.resetFormModel(model, this.model);
  }

  private resetFormModel(model: any, formModel: any, path?: (string | number)[]) {
    if (!isObject(model) && !Array.isArray(model)) {
      return;
    }

    // removes
    for (let key in formModel) {
      if (!(key in model) || isNullOrUndefined(model[key])) {
        if (!this.form.get((path || []).concat(key))) {
          // don't remove if bound to a control
          delete formModel[key];
        }
      }
    }

    // inserts and updates
    for (let key in model) {
      if (!isNullOrUndefined(model[key])) {
        if (key in formModel) {
          this.resetFormModel(model[key], formModel[key], (path || []).concat(key));
        }
        else {
          formModel[key] = model[key];
        }
      }
    }
  }

  private resetFormGroup(model: any, form: FormGroup, actualKey?: string) {
    for (let controlKey in form.controls) {
      let key = getKey(controlKey, actualKey);
      if (form.controls[controlKey] instanceof FormGroup) {
        this.resetFormGroup(model, <FormGroup>form.controls[controlKey], key);
      }
      if (form.controls[controlKey] instanceof FormArray) {
        this.resetArray(model, <FormArray>form.controls[controlKey], key);
      }
      if (form.controls[controlKey] instanceof FormControl) {
        form.controls[controlKey].setValue(getValueForKey(model, key));
      }
    }
  }

  private resetArray(model: any, formArray: FormArray, key: string) {
    let newValue = getValueForKey(model, key);

    // removes and updates
    for (let i = formArray.controls.length - 1; i >= 0; i--) {
      if (formArray.controls[i] instanceof FormGroup) {
        if (newValue && !isNullOrUndefined(newValue[i])) {
          this.resetFormGroup(newValue[i], <FormGroup>formArray.controls[i]);
        }
        else {
          formArray.removeAt(i);
          let value = getValueForKey(this.model, key);
          if (Array.isArray(value)) {
            value.splice(i, 1);
          }
        }
      }
    }

    // inserts
    if (Array.isArray(newValue) && formArray.controls.length < newValue.length) {
      let remaining = newValue.length - formArray.controls.length;
      let initialLength = formArray.controls.length;
      for (let i = 0; i < remaining; i++) {
        let pos = initialLength + i;
        getValueForKey(this.model, key).push(newValue[pos]);
        formArray.controls.push(new FormGroup({}));
      }
    }
  }

  private updateInitialValue() {
    let obj = reverseDeepMerge(this.form.value, this.model);
    this.initialModel = JSON.parse(JSON.stringify(obj));
  }
}
