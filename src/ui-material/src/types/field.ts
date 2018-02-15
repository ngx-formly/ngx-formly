import { OnInit, OnDestroy } from '@angular/core';
import { FieldType as CoreFieldType } from '@ngx-formly/core';
import { Subject } from 'rxjs/Subject';
import { MatFormFieldControl } from '@angular/material';
import { MatFormField } from '@angular/material/form-field';
import { FormlyErrorStateMatcher } from '../formly.error-state-matcher';

export abstract class FieldType extends CoreFieldType implements OnInit, OnDestroy, MatFormFieldControl<any> {
  formFieldControl: MatFormFieldControl<any> = this;
  errorStateMatcher = new FormlyErrorStateMatcher(this);
  stateChanges = new Subject<void>();
  _errorState = false;

  ngOnInit() {
    this.formField._control = this.formFieldControl;
    super.ngOnInit();
  }

  ngOnDestroy() {
    this.formFieldControl = null;
    if (this.formField) {
      delete this.formField._control;
    }
    this.stateChanges.complete();
    super.ngOnDestroy();
  }

  setDescribedByIds(ids: string[]): void { }
  onContainerClick(event: MouseEvent): void {
    this.field.focus = true;
    this.stateChanges.next();
  }

  get errorState() {
    const showError = this.options.showError(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }

    return showError;
  }

  get controlType() { return this.to.type; }
  get focused() { return this.field.focus && !this.disabled; }
  get disabled() { return this.to.disabled; }
  get required() { return this.to.required; }
  get placeholder() { return this.to.placeholder; }
  get shouldPlaceholderFloat() { return !!this.to.placeholder; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  get formField(): MatFormField { return (<any>this.field)['__formField__']; }
}
