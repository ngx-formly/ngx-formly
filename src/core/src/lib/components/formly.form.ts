import { Component, DoCheck, OnChanges, Input, SimpleChanges, Optional, EventEmitter, Output, SkipSelf, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, NgForm, FormGroupDirective, FormControl, AbstractControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyValueChangeEvent } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyFormExpression } from '../services/formly.form.expression';
import { FormlyConfig } from '../services/formly.config';
import { assignModelValue, isNullOrUndefined, reverseDeepMerge, getFieldModel, assignModelToFields } from '../utils';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let field of fields"
      [model]="field.model" [form]="form"
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

  private enableCheckExprDebounce = false;
  private checkExpressionChange$ = this.modelChange.pipe(
    debounceTime(this.enableCheckExprDebounce ? 100 : 0),
    tap(() => {
      this.enableCheckExprDebounce = true;
      this.checkExpressionChange();
      this.enableCheckExprDebounce = false;
    }),
  ).subscribe();

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
    this.checkExpressionChange$.unsubscribe();
  }

  changeModel(event: { key: string, value: any }) {
    assignModelValue(this.model, event.key, event.value);
    this.modelChange.emit(this.model);
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

    if (!(<any> this.options).resetTrackModelChanges) {
      (<any> this.options).resetTrackModelChanges = () => {
        this.clearModelSubscriptions();
        this.trackModelChanges(this.fields);
      };
    }
  }

  private checkExpressionChange() {
    if (this.isRoot) {
      this.formlyExpression.checkFields(this.form, this.fields, this.model, this.options);
    }
  }

  private trackModelChanges(fields: FormlyFieldConfig[], rootKey: string[] = []) {
    fields.forEach(field => {
      if (field.key && field.type && !field.fieldGroup && !field.fieldArray) {
        const valueChanges = field.formControl.valueChanges.pipe(
          field.modelOptions && field.modelOptions.debounce && field.modelOptions.debounce.default
          ? debounceTime(field.modelOptions.debounce.default)
          : tap(() => {}),
          map(value => {
            if (field.parsers && field.parsers.length > 0) {
              field.parsers.forEach(parserFn => value = parserFn(value));
            }

            return value;
          }),
          tap(value => this.changeModel({ key: [...rootKey, field.key].join('.'), value })),
        );

        this.modelChangeSubs.push(valueChanges.subscribe());
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
    assignModelToFields(this.fields, model);
    this.clearModelSubscriptions();
    this.resetFieldArray(this.fields);
    this.initializeFormValue(this.form);
    (<FormGroup> this.form).patchValue(model, { onlySelf: true });
    this.trackModelChanges(this.fields);
  }

  private resetModel(model?: any) {
    model = isNullOrUndefined(model) ? this.initialModel : model;
    assignModelToFields(this.fields, model);
    this.resetFieldArray(this.fields);

    // we should call `NgForm::resetForm` to ensure changing `submitted` state after resetting form
    // but only when the current component is a root one.
    if (!this.parentFormlyForm && this.options.parentForm && this.options.parentForm.control === this.form) {
      this.options.parentForm.resetForm(model);
    } else {
      this.form.reset(model);
    }

    (<any> this.options).resetTrackModelChanges();
  }

  private resetFieldArray(fields: FormlyFieldConfig[]) {
    fields.forEach(field => {
      if (field.fieldArray) {
        const formControl = <FormArray> field.formControl;
        while (formControl.length !== 0) {
          formControl.removeAt(0);
        }
        this.formlyBuilder.buildForm(field.formControl as FormArray, field.fieldGroup, field.model, this.options);
      } else if (field.fieldGroup) {
        this.resetFieldArray(field.fieldGroup);
      } else if (field.key && field.type) {
        field.formControl.reset(getFieldModel(field.model, field, false));
      }
    });
  }

  private initializeFormValue(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.setValue(null);
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(k => this.initializeFormValue(control.controls[k]));
    } else if (control instanceof FormArray) {
      control.controls.forEach(c => this.initializeFormValue(c));
    }
  }

  private updateInitialValue() {
    this.initialModel = reverseDeepMerge({}, this.model);
  }
}
