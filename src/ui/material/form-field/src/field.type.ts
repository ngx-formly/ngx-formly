import { OnInit, OnDestroy, AfterViewInit, TemplateRef, ViewChild, Type } from '@angular/core';
import { FieldType as CoreFieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';

export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> extends CoreFieldType<F> implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<any> {
  @ViewChild('matPrefix', { static: false }) matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix', { static: false }) matSuffix!: TemplateRef<any>;

  get formFieldControl() { return this._control || this; }
  set formFieldControl(control: MatFormFieldControl<any>) {
    this._control = control;
    if (this.formField && control !== this.formField._control) {
      this.formField._control = control;
    }
  }

  errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.field && this.showError };
  stateChanges = new Subject<void>();
  _errorState = false;
  private _control!: MatFormFieldControl<any>;

  ngOnInit() {
    if (this.formField) {
      this.formField._control = this.formFieldControl;
    }
  }

  ngAfterViewInit() {
    if (this.matPrefix) {
      this.to.prefix = this.matPrefix;
    }
    if (this.matSuffix) {
      this.to.prefix = this.matSuffix;
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
  set value(value) { this.formControl.patchValue(value); }
  get ngControl() { return this.formControl as any; }
  get empty() { return this.value === undefined || this.value === null || this.value === ''; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  get formField(): MatFormField { return this.field ? (<any> this.field)['__formField__'] : null; }
}
