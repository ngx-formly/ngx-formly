import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'formly-wrapper-mat-form-field',
  template: `
    <!-- fix https://github.com/angular/material2/pull/7083 by setting width to 100% -->
    <mat-form-field [hideRequiredMarker]="true" [floatLabel]="to.floatLabel" [style.width]="'100%'">
      <ng-container #fieldComponent></ng-container>
      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
      </mat-label>

      <ng-container matPrefix>
        <ng-container *ngTemplateOutlet="to.prefix"></ng-container>
      </ng-container>

      <ng-container matSuffix>
        <ng-container *ngTemplateOutlet="to.suffix"></ng-container>
      </ng-container>

      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: FormlyWrapperFormField }],
})
export class FormlyWrapperFormField extends FieldWrapper implements OnInit, OnDestroy, MatFormFieldControl<any>, AfterViewInit {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
  @ViewChild(MatFormField) formField: MatFormField;

  stateChanges = new Subject<void>();
  _errorState = false;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.formField._control = this;
    (<any> this.field)['__formField__'] = this.formField;
  }

  ngAfterViewInit() {
    // temporary fix for https://github.com/angular/material2/issues/7891
    if (this.formField.underlineRef && this.to.hideFieldUnderline === true) {
      this.renderer.removeClass(this.formField.underlineRef.nativeElement, 'mat-form-field-underline');
      this.renderer.removeClass(this.formField.underlineRef.nativeElement.firstChild, 'mat-form-field-ripple');
    }
  }

  ngOnDestroy() {
    delete (<any> this.field)['__formField__'];
    this.stateChanges.complete();
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
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
}
