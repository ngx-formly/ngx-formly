import { Component, DoCheck, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy, Attribute, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone } from '../utils';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'formly-form',
  template: `
    <formly-field *ngFor="let f of fields" [field]="f"></formly-field>
  `,
  providers: [FormlyFormBuilder],
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  @Input()
  set form(formControl: FormGroup | FormArray) { this.field.formControl = formControl; }
  get form() { return this.field.formControl as (FormGroup | FormArray); }

  @Input()
  set model(model: any) { this.setField({ model }); }
  get model() { return this.field.model; }

  @Input()
  set fields(fieldGroup: FormlyFieldConfig[]) { this.setField({ fieldGroup }); }
  get fields() { return this.field.fieldGroup; }

  @Input()
  set options(options: FormlyFormOptions) { this.setField({ options }); }
  get options() { return this.field.options; }

  @Output() modelChange = new EventEmitter<any>();

  private field: FormlyFieldConfigCache = {};
  private valueChangesUnsubscribe = () => {};

  constructor(
    private builder: FormlyFormBuilder,
    private config: FormlyConfig,
  ) {}

  ngDoCheck() {
    if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
      this.checkExpressionChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields || changes.form || changes.model) {
      this.builder.buildField(this.field);
      this.valueChangesUnsubscribe = this.valueChanges(this.field);
    }
  }

  ngOnDestroy() {
    this.valueChangesUnsubscribe();
  }

  private checkExpressionChange() {
    if (this.field.options && this.field.options._checkField) {
      this.field.options._checkField(this.field);
    }
  }

  private valueChanges(field: FormlyFieldConfigCache) {
    this.valueChangesUnsubscribe();

    let enableCheckExprDebounce = false;
    const sub = field.options.fieldChanges.pipe(
      tap(({ type }) => {
        if (type === 'valueChanges') {
          this.modelChange.emit(clone(this.field.model));
        }
      }),
      debounceTime(enableCheckExprDebounce ? 100 : 0),
      tap(() => {
        enableCheckExprDebounce = true;
        this.checkExpressionChange();
        enableCheckExprDebounce = false;
      }),
    ).subscribe();

    return () => sub.unsubscribe();
  }

  private setField(field: FormlyFieldConfigCache) {
    this.field = {
      ...this.field,
      ...(this.config.extras.immutable ? clone(field) : field),
    };
  }
}
