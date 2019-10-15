import { Component, DoCheck, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from './formly.field.config';
import { FormlyFormBuilder } from '../services/formly.form.builder';
import { FormlyConfig } from '../services/formly.config';
import { assignModelValue, clone, getKeyPath } from '../utils';
import { tap, switchMap, filter, take } from 'rxjs/operators';

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
    private ngZone: NgZone,
  ) {
  }

  ngDoCheck() {
    if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
      this.checkExpressionChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields || changes.form || changes.model) {
      this.builder.buildField(this.field);
      this.valueChangesUnsubscribe = this.valueChanges();
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

  private valueChanges() {
    this.valueChangesUnsubscribe();

    const sub = this.field.options.fieldChanges.pipe(
      filter(({ type }) => type === 'valueChanges'),
      tap(({ field, value }) => {
        if (
          value == null
          && field['autoClear']
          && !field.formControl.parent
        ) {
          const paths = getKeyPath(field);
          const k = paths.pop();
          const m = paths.reduce((model, path) => model[path] || {}, field.parent.model);
          delete m[k];
        } else {
          assignModelValue(field.parent.model, getKeyPath(field), value);
        }
      }),
      switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))),
    ).subscribe(() => {
      this.checkExpressionChange();
      this.modelChange.emit(clone(this.model));
    });

    return () => sub.unsubscribe();
  }

  private setField(field: FormlyFieldConfigCache) {
    this.field = {
      ...this.field,
      ...(this.config.extras.immutable ? clone(field) : field),
    };
  }
}
