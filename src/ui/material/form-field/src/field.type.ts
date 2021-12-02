import {
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  Type,
  Directive,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FieldType as CoreFieldType, ɵobserve as observe } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormlyFieldConfig } from './form-field.wrapper';

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig>
  extends CoreFieldType<F>
  implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<any>
{
  @ViewChild('matPrefix') matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix') matSuffix!: TemplateRef<any>;

  formFieldControl!: MatFormFieldControl<any>;
  @ViewChildren(MatFormFieldControl) set _controls(controls: QueryList<MatFormFieldControl<any>>) {
    if (controls.length === 1 && !this.formFieldControl) {
      this.formFieldControl = controls.first;
    }
  }

  errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.field && this.showError };
  stateChanges = new Subject<void>();
  _errorState = false;

  ngOnInit() {
    observe(this, ['formFieldControl'], ({ currentValue }) => {
      this.attachControl(currentValue || this);
    });
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
    delete (this.formField as any)?._control;
    this.stateChanges.complete();
  }

  setDescribedByIds(ids: string[]): void {}
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

    if (<any>this.field.type instanceof Type) {
      return this.field.type!.constructor.name;
    }

    return this.field.type!;
  }
  get focused() {
    return !!this.field.focus && !this.disabled;
  }
  get disabled() {
    return !!this.to.disabled;
  }
  get required() {
    return !!this.to.required;
  }
  get placeholder() {
    return this.to.placeholder || '';
  }
  get shouldPlaceholderFloat() {
    return this.shouldLabelFloat;
  }
  get value() {
    return this.formControl.value;
  }
  set value(value) {
    this.formControl.patchValue(value);
  }
  get ngControl() {
    return this.formControl as any;
  }
  get empty() {
    return this.value == null || this.value === '';
  }
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  get formField(): MatFormField {
    return (this.field as any)?.['_formField'];
  }

  private attachControl(control: MatFormFieldControl<any>) {
    if (this.formField && control !== this.formField._control) {
      this.formField._control = control;

      // temporary fix for https://github.com/angular/material2/issues/6728
      if (control?.ngControl?.valueAccessor?.hasOwnProperty('_formField')) {
        (control.ngControl.valueAccessor as any)['_formField'] = this.formField;
      }

      ['Prefix', 'Suffix'].forEach((type) =>
        observe<TemplateRef<any>>(
          this.field,
          ['templateOptions', type.toLowerCase()],
          ({ currentValue }) =>
            currentValue &&
            Promise.resolve().then(() => {
              this.field.templateOptions![`_mat${type}`] = currentValue;
              this.options.detectChanges!(this.field);
            }),
        ),
      );

      // https://github.com/angular/components/issues/16209
      const setDescribedByIds = control.setDescribedByIds.bind(control);
      control.setDescribedByIds = (ids: string[]) => {
        setTimeout(() => setDescribedByIds(ids));
      };
    }
  }
}
