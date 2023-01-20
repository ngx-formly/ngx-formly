import {
  Component,
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
  FormlyFieldConfig,
  FormlyFieldProps as CoreFormlyFieldProps,
  FieldWrapper,
} from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';

interface MatFormlyFieldConfig extends FormlyFieldConfig<FormlyFieldProps> {
  _formField?: FormlyWrapperFormField;
}

export interface FormlyFieldProps extends CoreFormlyFieldProps {
  prefix?: TemplateRef<any>;
  suffix?: TemplateRef<any>;
  textPrefix?: TemplateRef<any>;
  textSuffix?: TemplateRef<any>;
  hideLabel?: boolean;
  hideRequiredMarker?: boolean;
  hideFieldUnderline?: boolean;
  floatLabel?: FloatLabelType;
  appearance?: MatFormFieldAppearance;
  subscriptSizing?: 'fixed' | 'dynamic';
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
      [floatLabel]="props.floatLabel"
      [appearance]="props.appearance"
      [subscriptSizing]="props.subscriptSizing"
      [color]="props.color ?? 'primary'"
    >
      <ng-container #fieldComponent></ng-container>
      <mat-label *ngIf="props.label && props.hideLabel !== true">
        {{ props.label }}
        <span
          *ngIf="props.required && props.hideRequiredMarker !== true"
          aria-hidden="true"
          class="mat-form-field-required-marker"
          >*</span
        >
      </mat-label>

      <ng-containe matTextPrefix *ngIf="props.textPrefix">
        <ng-container [ngTemplateOutlet]="props.textPrefix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-containe>

      <ng-containe matPrefix *ngIf="props.prefix">
        <ng-container [ngTemplateOutlet]="props.prefix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-containe>

      <ng-containe matTextSuffix *ngIf="props.textSuffix">
        <ng-container [ngTemplateOutlet]="props.textSuffix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-containe>

      <ng-containe matSuffix *ngIf="props.suffix">
        <ng-container [ngTemplateOutlet]="props.suffix" [ngTemplateOutletContext]="{ field: field }"></ng-container>
      </ng-containe>

      <mat-error>
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>

      <mat-hint *ngIf="props.description || props.hintStart as hint">
        <ng-container [ngTemplateOutlet]="stringOrTemplate" [ngTemplateOutletContext]="{ content: hint }">
        </ng-container>
      </mat-hint>

      <mat-hint *ngIf="props.hintEnd as hintEnd" align="end">
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
  styleUrls: ['./form-field.wrapper.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormlyWrapperFormField
  extends FieldWrapper<MatFormlyFieldConfig>
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;

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
    if (this.formField.appearance !== 'outline' && this.props.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mat-form-field-underline');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.field._formField;
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
