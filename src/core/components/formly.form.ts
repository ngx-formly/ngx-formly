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
      [hide]="field.hideExpression" [model]="field.key?model[field.key]:model"
      [form]="form" [field]="field" [formModel]="model"
      (modelChange)="changeModel($event)"
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
  formId;

  constructor(
    private formlyBuilder: FormlyFormBuilder,
    private formlyUtils: FormlyUtils,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      this.model = this.model || {};
      this.formlyBuilder.buildForm(this.form, this.fields, this.model);
    }
  }

  changeModel(event: FormlyValueChangeEvent) {
    this.formlyUtils.assignModelValue(this.model, event.key, event.value);
  }
}
