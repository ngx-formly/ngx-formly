import { Component, DoCheck, OnChanges, Input, SimpleChanges, Optional, EventEmitter, Output, SkipSelf, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, NgForm, FormGroupDirective } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFormExpression } from '../services/formly.form.expression';
import { FormlyConfig } from '../services/formly.config';
import { assignModelValue, isNullOrUndefined, reverseDeepMerge, getFieldModel, clone } from '../utils';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { map } from 'rxjs/operator/map';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let field of fields"
      [model]="fieldModel(field)" [form]="form"
      [field]="field"
      [ngClass]="field.className"
      [options]="options">
    </formly-field>
    <ng-content></ng-content>
  `,
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  @Input() model: any = {};
  @Input() form: FormGroup | FormArray = new FormGroup({});
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() options: FormlyFormOptions;
  @Output() modelChange = new EventEmitter<any>();

  /** @internal */
  @Input() isRoot = true;

  private initialModel: any;
  private modelChangeSubs: Subscription[] = [];

  constructor(
    private formlyBuilder: FormlyFormBuilder,
    private formlyExpression: FormlyFormExpression,
    private formlyConfig: FormlyConfig,
    @Optional() private parentForm: NgForm,
    @Optional() private parentFormGroup: FormGroupDirective,
    @Optional() @SkipSelf() private parentFormlyForm: FormlyForm,
  ) {}

  ngDoCheck() {
    this.checkExpressionChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.fields || this.fields.length === 0 || !this.isRoot) {
      return;
    }

    if (changes.fields || changes.form) {
      this.model = this.model || {};
      this.form = this.form || (new FormGroup({}));
      this.setOptions();
      this.clearModelSubscriptions();
      this.formlyBuilder.buildForm(this.form, this.fields, this.model, this.options);
      this.trackModelChanges(this.fields);
      this.updateInitialValue();
    } else if (changes.model) {
      this.patchModel(this.model);
    }
  }

  ngOnDestroy() {
    this.clearModelSubscriptions();
  }

  fieldModel(field: FormlyFieldConfig, model = this.model) {
    if (field.key && (field.fieldGroup || field.fieldArray)) {
      return getFieldModel(model, field, true);
    }
    return model;
  }

  changeModel(event: { key: string, value: any }) {
    assignModelValue(this.model, event.key, event.value);
    this.modelChange.emit(this.model);
    this.checkExpressionChange();
  }

  setOptions() {
    this.options = this.options || {};

    this.options.formState = this.options.formState || {};
    if (!this.options.showError) {
      this.options.showError = this.formlyConfig.extras.showError;
    }
    if (!this.options.fieldChanges) {
      this.options.fieldChanges = new Subject<FormlyValueChangeEvent>();
    }

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
    this.formlyExpression.checkFields(this.form, this.fields, this.model, this.options);
  }

  private trackModelChanges(fields: FormlyFieldConfig[], rootKey: string[] = []) {
    fields.forEach(field => {
      if (field.key && (!field.fieldGroup || field.fieldGroup.length === 0)) {
        let valueChanges = field.formControl.valueChanges;
        const debounce = field.modelOptions && field.modelOptions.debounce && field.modelOptions.debounce.default;
        if (debounce > 0) {
          valueChanges = debounceTime.call(valueChanges, debounce);
        }
        if (field.parsers && field.parsers.length > 0) {
          field.parsers.forEach(parserFn => {
            valueChanges = map.call(valueChanges, parserFn);
          });
        }

        this.modelChangeSubs.push(valueChanges
          .subscribe(event => this.changeModel({ key: [...rootKey, field.key].join('.'), value: event })),
        );
      }

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        this.trackModelChanges(field.fieldGroup, field.key ? [...rootKey, field.key] : rootKey);
      }
    });
  }

  private clearModelSubscriptions() {
    this.modelChangeSubs.forEach(sub => sub.unsubscribe());
    this.modelChangeSubs = [];
  }

  private patchModel(model: any) {
    this.resetFieldArray(this.fields, model, this.model);
    (<FormGroup> this.form).patchValue(model, { onlySelf: true });
  }

  private resetModel(model?: any) {
    model = isNullOrUndefined(model) ? this.initialModel : model;
    this.resetFieldArray(this.fields, model, this.model);

    // we should call `NgForm::resetForm` to ensure changing `submitted` state after resetting form
    // but only when the current component is a root one.
    if (!this.parentFormlyForm && this.options.parentForm && this.options.parentForm.control === this.form) {
      this.options.parentForm.resetForm(model);
    } else {
      this.form.reset(model);
    }
  }

  private resetFieldArray(fields: FormlyFieldConfig[], newModel: any, modelToUpdate: any) {
    fields.forEach(field => {
      if ((field.fieldGroup && field.fieldGroup.length > 0) || field.fieldArray) {
        const newFieldModel = this.fieldModel(field, newModel),
          fieldModel = this.fieldModel(field, modelToUpdate);

        if (field.fieldArray) {
          field.fieldGroup = field.fieldGroup || [];
          field.fieldGroup.length = 0;

          if (fieldModel !== newFieldModel && fieldModel) {
            fieldModel.length = 0;
          }

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
          this.resetFieldArray(field.fieldGroup, newFieldModel, fieldModel);
        }
      }
    });
  }

  private updateInitialValue() {
    this.initialModel = reverseDeepMerge({}, this.model);
  }
}
