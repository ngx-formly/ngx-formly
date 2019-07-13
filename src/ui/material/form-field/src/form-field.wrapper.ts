import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, Renderer2, AfterViewInit, AfterContentChecked, TemplateRef } from '@angular/core';
import { ɵdefineHiddenProp as defineHiddenProp, FormlyFieldConfig, FieldWrapper } from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';

interface MatFormlyFieldConfig extends FormlyFieldConfig {
  _matprefix: TemplateRef<any>;
  _matsuffix: TemplateRef<any>;
  __formField__: FormlyWrapperFormField;
  _componentFactory: any;
}

@Component({
  selector: 'formly-wrapper-mat-form-field',
  template: `
    <!-- fix https://github.com/angular/material2/pull/7083 by setting width to 100% -->
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color"
      [style.width]="'100%'">
      <ng-container #fieldComponent></ng-container>
      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
      </mat-label>

      <ng-container matPrefix>
        <ng-container *ngTemplateOutlet="to.prefix ? to.prefix : field._matprefix"></ng-container>
      </ng-container>

      <ng-container matSuffix>
        <ng-container *ngTemplateOutlet="to.suffix ? to.suffix : field._matsuffix"></ng-container>
      </ng-container>

      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
})
export class FormlyWrapperFormField extends FieldWrapper implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent!: ViewContainerRef;
  @ViewChild(MatFormField) formField!: MatFormField;
  field!: MatFormlyFieldConfig;

  private initialGapCalculated = false;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    defineHiddenProp(this.field, '__formField__', this.formField);

    // fix for https://github.com/angular/material2/issues/11437
    if (this.field.hide && this.field.templateOptions!.appearance === 'outline') {
      this.initialGapCalculated = true;
    }
  }

  ngAfterContentChecked() {
    if (!this.initialGapCalculated || this.field.hide) {
      return;
    }

    this.formField.updateOutlineGap();
    this.initialGapCalculated = true;
  }

  ngAfterViewInit() {
    // temporary fix for https://github.com/angular/material2/issues/7891
    if (this.formField.underlineRef && this.to.hideFieldUnderline === true) {
      this.renderer.removeClass(this.formField.underlineRef.nativeElement, 'mat-form-field-underline');
      this.renderer.removeClass(this.formField.underlineRef.nativeElement.firstChild, 'mat-form-field-ripple');
    }
  }

  ngOnDestroy() {
    delete this.field.__formField__;
  }
}
