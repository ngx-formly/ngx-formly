import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Renderer2,
  AfterViewChecked,
  OnDestroy,
  AfterViewInit,
  Type,
} from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { FocusMonitor } from '@angular/cdk/a11y';

interface CheckboxProps extends FormlyFieldProps {
  indeterminate?: boolean;
  labelPosition?: 'before' | 'after';
}

export interface FormlyCheckboxFieldConfig extends FormlyFieldConfig<CheckboxProps> {
  type: 'checkbox' | Type<FormlyFieldCheckbox>;
}

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [name]="field.name"
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [indeterminate]="props.indeterminate && formControl.value == null"
      [color]="props.color"
      [labelPosition]="props.labelPosition"
    >
      {{ props.label }}
      <span
        *ngIf="props.required && props.hideRequiredMarker !== true"
        aria-hidden="true"
        class="mat-form-field-required-marker mat-mdc-form-field-required-marker"
        >*</span
      >
    </mat-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldCheckbox
  extends FieldType<FieldTypeConfig<CheckboxProps>>
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
  @ViewChild(MatCheckbox, { static: true }) checkbox!: MatCheckbox;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      indeterminate: true,
      floatLabel: 'always' as const,
      hideLabel: true,
      color: 'accent' as const, // workaround for https://github.com/angular/components/issues/18465
    },
  };

  private _required!: boolean;
  constructor(private renderer: Renderer2, private focusMonitor: FocusMonitor) {
    super();
  }

  override onContainerClick(event: MouseEvent): void {
    this.checkbox.focus();
    super.onContainerClick(event);
  }

  ngAfterViewInit() {
    if (this.checkbox) {
      this.focusMonitor.monitor(this.checkbox._inputElement, true).subscribe((focusOrigin) => {
        this.field.focus = !!focusOrigin;
        this.stateChanges.next();
        if (focusOrigin) {
          this.props.focus && this.props.focus(this.field);
        } else {
          this.props.blur && this.props.blur(this.field);
        }
      });
    }
  }

  ngAfterViewChecked() {
    if (this.required !== this._required && this.checkbox && this.checkbox._inputElement) {
      this._required = this.required;
      const inputElement = this.checkbox._inputElement.nativeElement;
      if (this.required) {
        this.renderer.setAttribute(inputElement, 'required', 'required');
      } else {
        this.renderer.removeAttribute(inputElement, 'required');
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.checkbox) {
      this.focusMonitor.stopMonitoring(this.checkbox._inputElement);
    }
  }
}
