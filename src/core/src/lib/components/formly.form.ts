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
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from '../models';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone } from '../utils';
import { switchMap, filter, take } from 'rxjs/operators';
import { clearControl } from '../extensions/field-form/utils';
import { FormlyFieldTemplates, FormlyTemplate } from './formly.template';

@Component({
  selector: 'formly-form',
  template: '<formly-field [field]="field"></formly-field>',
  providers: [FormlyFormBuilder, FormlyFieldTemplates],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  @Input()
  set form(form: FormGroup | FormArray) {
    this.field.form = form;
  }
  get form() {
    return this.field.form as FormGroup | FormArray;
  }

  @Input()
  set model(model: any) {
    this.setField({ model });
  }
  get model() {
    return this.field.model;
  }

  @Input()
  set fields(fieldGroup: FormlyFieldConfig[]) {
    this.setField({ fieldGroup });
  }
  get fields() {
    return this.field.fieldGroup;
  }

  @Input()
  set options(options: FormlyFormOptions) {
    this.setField({ options });
  }
  get options() {
    return this.field.options;
  }

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

    const sub = this.field.options.fieldChanges
      .pipe(
        filter(({ type }) => type === 'valueChanges'),
        switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))),
      )
      .subscribe(() =>
        this.ngZone.runGuarded(() => {
          // runGuarded is used to keep in sync the expression changes
          // https://github.com/ngx-formly/ngx-formly/issues/2095
          this.checkExpressionChange();
          this.modelChange.emit((this._modelChangeValue = clone(this.model)));
        }),
      );

    return () => sub.unsubscribe();
  }

  private setField(field: FormlyFieldConfigCache) {
    if (this.config.extras.immutable) {
      this.field = { ...this.field, ...clone(field) };
    } else {
      Object.keys(field).forEach((p) => (this.field[p] = field[p]));
    }
  }
}
