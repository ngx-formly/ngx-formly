import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyValueChangeEvent } from './../services/formly.event.emitter';
import { FormlyFieldConfig } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyUtils } from './../services/formly.utils';

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

  constructor(
    private formlyBuilder: FormlyFormBuilder,
    private formlyUtils: FormlyUtils,
  ) {}

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
    if (field.key && (field.fieldGroup || field.fieldArray) && this.model[field.key]) {
      return this.model[field.key];
    }

    return this.model;
  }

  changeModel(event: FormlyValueChangeEvent) {
    this.formlyUtils.assignModelValue(this.model, event.key, event.value);
  }

  setOptions() {
    this.options = this.options || {};
    this.options.resetModel = this.resetModel.bind(this);
    this.options.updateInitialValue = this.updateInitialValue.bind(this);
  }

  private resetModel() {
    this.form.patchValue(this.initialModel);
  }

  private updateInitialValue() {
    this.initialModel = Object.assign({}, this.form.value);
  }
}
