import { Component, DoCheck, OnChanges, Input, SimpleChanges, Optional, EventEmitter, Output, OnDestroy, Attribute, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective, FormControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFormOptionsCache } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyConfig } from '../services/formly.config';
import { assignModelValue, isNullOrUndefined, wrapProperty, clone, defineHiddenProp, getKeyPath } from '../utils';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, take } from 'rxjs/operators';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let field of fields"
      hide-deprecation
      [form]="field.form"
      [options]="field.options"
      [model]="field.model"
      [field]="field">
    </formly-field>
    <ng-container #content>
      <ng-content></ng-content>
    </ng-container>
  `,
  providers: [FormlyFormBuilder],
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  @Input() form: FormGroup | FormArray;

  @Input()
  set model(model: any) { this._model = this.immutable ? clone(model) : model; }
  get model() { return this._model || {}; }

  @Input()
  set fields(fields: FormlyFieldConfig[]) { this._fields = this.immutable ? clone(fields) : fields; }
  get fields() { return this._fields || []; }

  @Input()
  set options(options: FormlyFormOptions) { this._options = this.immutable ? clone(options) : options; }
  get options() { return this._options; }

  @Output() modelChange = new EventEmitter<any>();
  @ViewChild('content') set content(content: ElementRef<HTMLElement>) {
    if (content && content.nativeElement.nextSibling) {
      console.warn(`NgxFormly: content projection for 'formly-form' component is deprecated since v5.5, you should avoid passing content inside the 'formly-form' tag.`);
    }
  }

  private immutable = false;
  private _model: any;
  private _fields: FormlyFieldConfig[];
  private _options: FormlyFormOptions;
  private modelChangeSubs: Subscription[] = [];
  private modelChange$ = new Subject<void>();
  private modelChangeSub = this.modelChange$.pipe(
    switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))),
  ).subscribe(() => {
    this.checkExpressionChange();
    this.modelChange.emit(clone(this.model));
  });

  constructor(
    private formlyBuilder: FormlyFormBuilder,
    private formlyConfig: FormlyConfig,
    private ngZone: NgZone,
    // tslint:disable-next-line
    @Attribute('immutable') immutable,
    @Optional() private parentFormGroup: FormGroupDirective,
  ) {
    if (immutable !== null) {
      console.warn(`NgxFormly: passing 'immutable' attribute to 'formly-form' component is deprecated since v5.5, enable immutable mode through NgModule declaration instead.`);
    }

    this.immutable = (immutable !== null) || !!formlyConfig.extras.immutable;
  }

  ngDoCheck() {
    if (this.formlyConfig.extras.checkExpressionOn === 'changeDetectionCheck') {
      this.checkExpressionChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields || changes.form || changes.model) {
      this.form = this.form || (new FormGroup({}));
      this.setOptions();
      this.options.updateInitialValue();
      this.clearModelSubscriptions();
      this.formlyBuilder.buildForm(this.form, this.fields, this.model, this.options);
      this.trackModelChanges(this.fields);
    }
  }

  ngOnDestroy() {
    this.modelChangeSub.unsubscribe();
    this.clearModelSubscriptions();
  }

  changeModel({ key, value, field }: { key: string, value: any, field: FormlyFieldConfig }) {
    if (
      value == null
      && field['autoClear']
      && !field.formControl.parent
    ) {
      const paths = key.split('.');
      const k = paths.pop();
      const m = paths.reduce((model, path) => model[path] || {}, this.model);
      delete m[k];
    } else {
      assignModelValue(this.model, key.split('.'), value);
    }

    this.modelChange$.next();
  }

  setOptions() {
    if (!this.options) {
      this.options = {};
    }

    if (!this.options.resetModel) {
      this.options.resetModel = (model ?: any) => {
        model = clone(isNullOrUndefined(model) ? (<FormlyFormOptionsCache> this.options)._initialModel : model);
        if (this.model) {
          Object.keys(this.model).forEach(k => delete this.model[k]);
          Object.assign(this.model, model || {});
        }

        (<FormlyFormOptionsCache> this.options)._buildForm();

        // we should call `NgForm::resetForm` to ensure changing `submitted` state after resetting form
        // but only when the current component is a root one.
        if (this.options.parentForm && this.options.parentForm.control === this.form) {
          this.options.parentForm.resetForm(model);
        } else {
          this.form.reset(model);
        }
      };
    }

    if (!this.options.parentForm && this.parentFormGroup) {
      defineHiddenProp(this.options, 'parentForm', this.parentFormGroup);
      wrapProperty(this.options.parentForm, 'submitted', ({ firstChange }) => {
        if (!firstChange) {
          this.checkExpressionChange();
          (<FormlyFormOptionsCache> this.options)._markForCheck({
            fieldGroup: this.fields,
            model: this.model,
            formControl: this.form,
            options: this.options,
          });
        }
      });
    }

    if (!this.options.updateInitialValue) {
      this.options.updateInitialValue = () => (<FormlyFormOptionsCache> this.options)._initialModel = clone(this.model);
    }

    if (!(<FormlyFormOptionsCache> this.options)._buildForm) {
      (<FormlyFormOptionsCache> this.options)._buildForm = (emitModelChange = false) => {
        this.clearModelSubscriptions();
        this.formlyBuilder.buildForm(this.form, this.fields, this.model, this.options);
        this.trackModelChanges(this.fields);

        if (emitModelChange) {
          this.modelChange.emit(clone(this.model));
        }
      };
    }
  }

  private checkExpressionChange() {
    if (this.options && (<FormlyFormOptionsCache> this.options)._checkField) {
      (<FormlyFormOptionsCache> this.options)._checkField({
        fieldGroup: this.fields,
        model: this.model,
        formControl: this.form,
        options: this.options,
      });
    }
  }

  private trackModelChanges(fields: FormlyFieldConfig[], rootKey: string[] = []) {
    fields.forEach(field => {
      if (field.key && !field.fieldGroup) {
        const control = field.formControl;
        let valueChanges = control.valueChanges.pipe(distinctUntilChanged());

        const { updateOn, debounce } = field.modelOptions;
        if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
          valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
        }

        this.modelChangeSubs.push(valueChanges.subscribe((value) => {
          // workaround for https://github.com/angular/angular/issues/13792
          if (control instanceof FormControl && control['_fields'] && control['_fields'].length > 1) {
            control.patchValue(value, { emitEvent: false, onlySelf: true });
          }

          if (field.parsers && field.parsers.length > 0) {
            field.parsers.forEach(parserFn => value = parserFn(value));
          }

          this.changeModel({ key: [...rootKey, ...getKeyPath(field)].join('.'), value, field });
        }));
      }

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        this.trackModelChanges(field.fieldGroup, field.key ? [...rootKey, ...getKeyPath(field)] : rootKey);
      }
    });
  }

  private clearModelSubscriptions() {
    this.modelChangeSubs.forEach(sub => sub.unsubscribe());
    this.modelChangeSubs = [];
  }
}
