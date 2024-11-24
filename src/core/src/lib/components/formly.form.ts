import {
  Component,
  ChangeDetectionStrategy,
  DoCheck,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  NgZone,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../models';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone, hasKey, isNoopNgZone, isSignalRequired, observeDeep } from '../utils';
import { switchMap, filter, take } from 'rxjs/operators';
import { clearControl } from '../extensions/field-form/utils';
import { FormlyFieldTemplates, FormlyTemplate } from './formly.template';
import { of, Subscription } from 'rxjs';
import { FormlyField } from './formly.field';

/**
 * The `<form-form>` component is the main container of the form,
 * which takes care of managing the form state
 * and delegates the rendering of each field to `<formly-field>` component.
 */
@Component({
  selector: 'formly-form',
  template: '<formly-field [field]="field"></formly-field>',
  providers: [FormlyFormBuilder, FormlyFieldTemplates],
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  /** The form instance which allow to track model value and validation status. */
  @Input()
  set form(form: UntypedFormGroup | UntypedFormArray) {
    this.field.form = form;
  }
  get form(): UntypedFormGroup | UntypedFormArray {
    return this.field.form;
  }

  /** The model to be represented by the form. */
  @Input()
  set model(model: any) {
    if (this.config.extras.immutable && this._modelChangeValue === model) {
      return;
    }

    this.setField({ model });
  }
  get model(): any {
    return this.field.model;
  }

  /** The field configurations for building the form. */
  @Input()
  set fields(fieldGroup: FormlyFieldConfig[]) {
    this.setField({ fieldGroup });
  }
  get fields(): FormlyFieldConfig[] {
    return this.field.fieldGroup;
  }

  /** Options for the form. */
  @Input()
  set options(options: FormlyFormOptions) {
    this.setField({ options });
  }
  get options(): FormlyFormOptions {
    return this.field.options;
  }

  /** Event that is emitted when the model value is changed */
  @Output() modelChange = new EventEmitter<any>();
  @ContentChildren(FormlyTemplate) set templates(templates: QueryList<FormlyTemplate>) {
    this.fieldTemplates.templates = templates;
  }

  field: FormlyFieldConfigCache = { type: 'formly-group' };
  private _modelChangeValue: any = {};
  private valueChangesUnsubscribe = () => {};

  constructor(
    private builder: FormlyFormBuilder,
    private config: FormlyConfig,
    private ngZone: NgZone,
    private fieldTemplates: FormlyFieldTemplates,
  ) {}

  ngDoCheck() {
    if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
      this.checkExpressionChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields && this.form) {
      clearControl(this.form);
    }

    if (changes.fields || changes.form || (changes.model && this._modelChangeValue !== changes.model.currentValue)) {
      this.valueChangesUnsubscribe();
      this.builder.build(this.field);
      this.valueChangesUnsubscribe = this.valueChanges();
    }
  }

  ngOnDestroy() {
    this.valueChangesUnsubscribe();
  }

  private checkExpressionChange() {
    this.field.options.checkExpressions?.(this.field);
  }

  private valueChanges() {
    this.valueChangesUnsubscribe();

    let formEvents: Subscription | null = null;
    if (isSignalRequired()) {
      let submitted = this.options?.parentForm?.submitted;
      formEvents = (this.form as any).events.subscribe(() => {
        if (submitted !== this.options?.parentForm?.submitted) {
          this.options.detectChanges(this.field);
          submitted = this.options?.parentForm?.submitted;
        }
      });
    }

    const fieldChangesDetection: any[] = [
      observeDeep(this.field.options, ['formState'], () => this.field.options.detectChanges(this.field)),
    ];
    const valueChanges = this.field.options.fieldChanges
      .pipe(
        filter(({ field, type }) => hasKey(field) && type === 'valueChanges'),
        switchMap(() => (isNoopNgZone(this.ngZone) ? of(null) : this.ngZone.onStable.asObservable().pipe(take(1)))),
      )
      .subscribe(() =>
        this.ngZone.runGuarded(() => {
          // runGuarded is used to keep in sync the expression changes
          // https://github.com/ngx-formly/ngx-formly/issues/2095
          this.checkExpressionChange();
          this.modelChange.emit((this._modelChangeValue = clone(this.model)));
        }),
      );

    return () => {
      fieldChangesDetection.forEach((fnc) => fnc());
      formEvents?.unsubscribe();
      valueChanges.unsubscribe();
    };
  }

  private setField(field: FormlyFieldConfigCache) {
    if (this.config.extras.immutable) {
      this.field = { ...this.field, ...clone(field) };
    } else {
      Object.keys(field).forEach((p) => ((this.field as any)[p] = (field as any)[p]));
    }
  }
}

@Component({
  selector: 'formly-form',
  template: '<formly-field [field]="field"></formly-field>',
  providers: [FormlyFormBuilder, FormlyFieldTemplates],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LegacyFormlyForm extends FormlyForm {}
