import { Component, DoCheck, OnChanges, Input, SimpleChanges, Optional, EventEmitter, Output, SkipSelf } from '@angular/core';
import { FormGroup, FormArray, NgForm, FormGroupDirective } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFormExpression } from '../services/formly.form.expression';
import { assignModelValue, isNullOrUndefined, reverseDeepMerge, getFieldModel, clone } from '../utils';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let field of fields"
      [model]="fieldModel(field)" [form]="form"
      [field]="field" (modelChange)="changeModel($event)"
      [ngClass]="field.className"
      [options]="options">
    </formly-field>
    <ng-content></ng-content>
  `,
})
export class FormlyForm implements DoCheck, OnChanges {
  @Input() model: any = {};
  @Input() form: FormGroup | FormArray = new FormGroup({});
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() options: FormlyFormOptions;

  @Output() modelChange = new EventEmitter<any>();

  private initialModel: any;

  constructor(
    private formlyBuilder: FormlyFormBuilder,
    private formlyExpression: FormlyFormExpression,
    @Optional() private parentForm: NgForm,
    @Optional() private parentFormGroup: FormGroupDirective,
    @Optional() @SkipSelf() private parentFormlyForm: FormlyForm,
  ) {}

  ngDoCheck() {
    this.checkExpressionChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.model = this.model || {};
      this.form = this.form || (new FormGroup({}));
      this.setOptions();
      this.formlyBuilder.buildForm(this.form, this.fields, this.model, this.options);
      this.updateInitialValue();
    } else if (changes.model && this.fields && this.fields.length > 0) {
      (<any>this.form).patchValue(this.model);
    }
  }

  fieldModel(field: FormlyFieldConfig, model = this.model) {
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      return getFieldModel(model, field, true);
    }
    return model;
  }

  changeModel(event: { key: string, value: any }) {
    assignModelValue(this.model, event.key, event.value);
    this.emitModelChange();
    this.checkExpressionChange();
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
    if (this.parentFormlyForm) {
      this.parentFormlyForm.emitModelChange();
    }
  }

  setOptions() {
    this.options = this.options || {};
    if (!this.options.resetModel) {
      this.options.resetModel = this.resetModel.bind(this);
    }

    if (!this.options.parentForm) {
      this.options.parentForm = this.parentFormGroup || this.parentForm;
    }

    if (!this.options.updateInitialValue) {
      this.options.updateInitialValue = this.updateInitialValue.bind(this);
    }
  }

  private checkExpressionChange() {
    // only eval expressions it's a root component
    if (!this.parentFormlyForm) {
      this.formlyExpression.checkFields(this.form, this.fields, this.model, this.options);
    }
  }

  private resetModel(model?: any) {
    model = isNullOrUndefined(model) ? this.initialModel : model;
    this.resetForm(this.fields, model, this.model);
    if (this.options.parentForm) {
      this.options.parentForm.resetForm(model);
    } else {
      this.form.reset(model);
    }
  }

  private resetForm(fields: FormlyFieldConfig[], newModel: any, modelToUpdate: any) {
    fields.forEach(field => {
      if (field.fieldGroup && field.fieldGroup.length > 0) {
        let newFieldModel = this.fieldModel(field, newModel),
          fieldModel = this.fieldModel(field, modelToUpdate);
        if (field.fieldArray) {
          field.fieldGroup.length = 0;
          fieldModel.length = 0;
          const formControl = <FormArray>field.formControl;
          while (formControl.length !== 0) {
            formControl.removeAt(0);
          }

          newFieldModel.forEach((m: any, i: number) => {
            fieldModel[i] = m;
            field.fieldGroup.push({ ...clone(field.fieldArray), key: `${i}` });
            this.formlyBuilder.buildForm(formControl, [field.fieldGroup[i]], newFieldModel, this.options);
          });
        } else {
          this.resetForm(field.fieldGroup, newFieldModel, fieldModel);
        }
      }
    });
  }

  private updateInitialValue() {
    this.initialModel = reverseDeepMerge({}, this.model);
  }
}
