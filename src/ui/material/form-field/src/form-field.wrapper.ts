import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  OnDestroy,
  Renderer2,
  AfterViewInit,
  AfterContentChecked,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵdefineHiddenProp as defineHiddenProp,
  ɵobserve as observe,
  FormlyFieldConfig,
  FieldWrapper,
} from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';

interface MatFormlyFieldConfig extends FormlyFieldConfig {
  __formField__: FormlyWrapperFormField;
}

@Component({
  selector: 'formly-wrapper-mat-form-field',
  template: `
    <!-- fix https://github.com/angular/material2/pull/7083 by setting width to 100% -->
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color">
      <ng-container #fieldComponent></ng-container>
      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" aria-hidden="true" class="mat-form-field-required-marker">*</span>
      </mat-label>

      <ng-container matPrefix *ngIf="to._matPrefix">
        <ng-container *ngTemplateOutlet="to._matPrefix"></ng-container>
      </ng-container>

      <ng-container matSuffix *ngIf="to._matSuffix">
        <ng-container *ngTemplateOutlet="to._matSuffix"></ng-container>
      </ng-container>

      <mat-error>
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-field.wrapper.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyWrapperFormField extends FieldWrapper<MatFormlyFieldConfig>
  implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent!: ViewContainerRef;
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;
  field!: MatFormlyFieldConfig;

  private initialGapCalculated = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private focusMonitor: FocusMonitor) {
    super();
  }

  ngOnInit() {
    defineHiddenProp(this.field, '__formField__', this.formField);
    ['prefix', 'suffix'].forEach((type) =>
      observe<TemplateRef<any>>(
        this.field,
        ['templateOptions', type],
        ({ currentValue }) =>
          currentValue &&
          Promise.resolve().then(() => {
            (<any>this.field)[`_mat${type}`] = currentValue;
            (<any>this.options)._markForCheck(this.field);
          }),
      ),
    );

    // fix for https://github.com/angular/material2/issues/11437
    if (this.field.hide && this.field.templateOptions!.appearance === 'outline') {
      this.initialGapCalculated = true;
    }

    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focus) {
        this.field.focus = false;
      }
    });
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
    if (this.formField.appearance !== 'outline' && this.to.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mat-form-field-underline');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.field.__formField__;
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
