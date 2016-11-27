import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyValueChangeEvent } from './../services/formly.event.emitter';
import { FormlyFieldConfig } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { assignModelValue } from './../utils';
import { reverseDeepMerge, getKey, getValueForKey } from '../utils';

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
      if (!this.model[field.key]) {
        this.model[field.key] = {};
      }

      return this.model[field.key];
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

  private resetModel() {
    this.form.patchValue(this.initialModel);
    this.resetFormGroup(this.form);
  }

  private resetFormGroup(form: FormGroup, actualKey?: string) {
    for (let controlKey in form.controls) {
      if (form.controls[controlKey] instanceof FormGroup) {
        this.resetFormGroup(<FormGroup>form.controls[controlKey], getKey(controlKey, actualKey));
      }
      if (form.controls[controlKey] instanceof FormArray) {
        this.resetArray(<FormArray>form.controls[controlKey], getKey(controlKey, actualKey));
      }
    }
  }

  private resetArray(formArray: FormArray, key: string) {
    for (let i in formArray.controls) {
      if  (formArray.controls[i] instanceof FormGroup && getValueForKey(this.initialModel, key)[i]) {
        formArray.controls[i].patchValue(getValueForKey(this.initialModel, key)[i]);
      } else if (formArray.controls[i] instanceof FormGroup && !getValueForKey(this.initialModel, key)[i]) {
        formArray.removeAt(parseInt(i, 10));
        getValueForKey(this.model, key).splice(i, 1);
      }
    }
    if (formArray.controls.length < getValueForKey(this.initialModel, key).length) {
      let remaining = getValueForKey(this.initialModel, key).length - formArray.controls.length;
      let initialLength = formArray.controls.length;
      for (let i = 0; i < remaining; i++) {
        let pos = initialLength + i;
        formArray.setControl(pos, new FormGroup({}));
        setTimeout(() => {
          getValueForKey(this.model, key).push(getValueForKey(this.initialModel, key)[pos]);
          formArray.controls[pos].setValue(getValueForKey(this.initialModel, key)[pos]);
        });
      }
    }
  }

  private updateInitialValue() {
    let obj = reverseDeepMerge(this.form.value, this.model);
    this.initialModel = JSON.parse(JSON.stringify(obj));
  }
}
