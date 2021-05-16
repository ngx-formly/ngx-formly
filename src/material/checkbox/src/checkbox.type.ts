import { Component, ViewChild, Renderer2, AfterViewChecked, OnDestroy, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'formly-field-mat-checkbox',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [id]="id"
      [formlyAttributes]="field"
      [tabIndex]="to.tabindex"
      [indeterminate]="to.indeterminate && formControl.value === null"
      [color]="to.color"
      [labelPosition]="to.align || to.labelPosition">
      {{ to.label }}
      <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
    </mat-checkbox>
  `,
})
export class FormlyFieldCheckbox extends FieldType implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild(MatCheckbox, <any> { static: true })checkbox!: MatCheckbox;
  defaultOptions = {
    templateOptions: {
      hideFieldUnderline: true,
      indeterminate: true,
      floatLabel: 'always',
      hideLabel: true,
      align: 'start', // start or end
      color: 'accent', // workaround for https://github.com/angular/components/issues/18465
    },
  };

  private _required!: boolean;
  constructor(private renderer: Renderer2, private focusMonitor: FocusMonitor) {
    super();
  }

  onContainerClick(event: MouseEvent): void {
    this.checkbox.focus();
    super.onContainerClick(event);
  }

  ngAfterViewInit() {
    if (this.checkbox) {
      this.focusMonitor.monitor(this.checkbox._inputElement, true).subscribe(focusOrigin => {
        if (focusOrigin) {
          this.to.focus && this.to.focus(this.field);
        } else {
          this.to.blur && this.to.blur(this.field);
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

  ngOnDestroy() {
    if (this.checkbox) {
      this.focusMonitor.stopMonitoring(this.checkbox._inputElement);
    }
  }
}
