import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  OnDestroy,
  Renderer2,
  AfterViewInit,
  ElementRef,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import {
  ɵdefineHiddenProp as defineHiddenProp,
  FormlyFieldConfig as CoreFieldConfig,
  FormlyTemplateOptions,
  FieldWrapper,
} from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field/form-field';
import { ThemePalette } from '@angular/material/core';

interface MatFormlyFieldConfig extends FormlyFieldConfig {
  _formField?: FormlyWrapperFormField;
}

export interface FormlyFieldConfig extends CoreFieldConfig {
  templateOptions?: MatFormlyTemplateOptions;
}

interface MatFormlyTemplateOptions extends FormlyTemplateOptions {
  prefix?: TemplateRef<any>;
  suffix?: TemplateRef<any>;
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
  hideFieldUnderline?: boolean;
  floatLabel?: FloatLabelType;
  appearance?: MatFormFieldAppearance;
  color?: ThemePalette;
  hintStart?: TemplateRef<any> | string;
  hintEnd?: TemplateRef<any> | string;
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
    >
      <ng-container #fieldComponent></ng-container>
      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span
          *ngIf="to.required && to.hideRequiredMarker !== true"
          aria-hidden="true"
          class="mat-form-field-required-marker"
          >*</span
        >
      </mat-label>

      <ng-container matPrefix *ngIf="to._matPrefix">
        <ng-container [ngTemplateOutlet]="to._matPrefix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-container>

      <ng-container matSuffix *ngIf="to._matSuffix">
        <ng-container [ngTemplateOutlet]="to._matSuffix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-container>

      <mat-error>
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>

      <mat-hint *ngIf="to.description || to.hintStart as hint">
        <ng-container [ngTemplateOutlet]="stringOrTemplate" [ngTemplateOutletContext]="{ content: hint }">
        </ng-container>
      </mat-hint>

      <mat-hint *ngIf="to.hintEnd as hintEnd" align="end">
        <ng-container [ngTemplateOutlet]="stringOrTemplate" [ngTemplateOutletContext]="{ content: hintEnd }">
        </ng-container>
      </mat-hint>
    </mat-form-field>

    <ng-template #stringOrTemplate let-content="content">
      <ng-container *ngIf="!content.createEmbeddedView; else template">{{ content }}</ng-container>
      <ng-template #template>
        <ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-field.wrapper.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyWrapperFormField
  extends FieldWrapper<MatFormlyFieldConfig>
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;
  field!: MatFormlyFieldConfig;

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private focusMonitor: FocusMonitor) {
    super();
  }

  ngOnInit() {
    defineHiddenProp(this.field, '_formField', this.formField);
    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focus) {
        this.field.focus = false;
      }
    });
  }

  ngAfterViewInit() {
    // temporary fix for https://github.com/angular/material2/issues/7891
    if (this.formField.appearance !== 'outline' && this.to.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mat-form-field-underline');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.field._formField;
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
