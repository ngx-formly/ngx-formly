import { OnInit, OnDestroy, AfterViewInit, TemplateRef, ViewChild, Type } from '@angular/core';
import { FieldType as CoreFieldType, ɵdefineHiddenProp as defineHiddenProp, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { FormlyErrorStateMatcher } from './formly.error-state-matcher';

export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> extends CoreFieldType<F> implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<any> {
  @ViewChild('matPrefix') matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix') matSuffix!: TemplateRef<any>;

  formFieldControl: MatFormFieldControl<any> = this;
  errorStateMatcher = new FormlyErrorStateMatcher(this);
  stateChanges = new Subject<void>();
  _errorState = false;

  ngOnInit() {
    if (this.formField) {
      this.formField._control = this.formFieldControl;
    }
  }

  ngAfterViewInit() {
    if (this.matPrefix || this.matSuffix) {
      setTimeout(() => {
        defineHiddenProp(this.field, '_matPrefix', this.matPrefix);
        defineHiddenProp(this.field, '_matSuffix', this.matSuffix);
        (<any> this.options)._markForCheck(this.field);
      });
    }
  }

  ngOnDestroy() {
    if (this.formField) {
      delete this.formField._control;
    }
    this.stateChanges.complete();
  }

  setDescribedByIds(ids: string[]): void { }
  onContainerClick(event: MouseEvent): void {
    this.field.focus = true;
    this.stateChanges.next();
  }

  get errorState() {
    const showError = this.options!.showError!(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }

    return showError;
  }

  get controlType() {
    if (this.to.type) {
      return this.to.type;
    }

    if ((<any> this.field.type) instanceof Type) {
      return this.field.type!.constructor.name;
    }

    return this.field.type!;
  }
  get focused() { return !!this.field.focus && !this.disabled; }
  get disabled() { return !!this.to.disabled; }
  get required() { return !!this.to.required; }
  get placeholder() { return this.to.placeholder || ''; }
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  get formField(): MatFormField { return (<any>this.field)['__formField__']; }
}
