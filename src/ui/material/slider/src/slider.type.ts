import { Component, ChangeDetectionStrategy, ViewChild, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
//import { FieldType, FormlyFieldProps } from '@ngx-formly/core';
import {
  MatSlider,
  //MatSliderChange,
  MatSliderThumb,
} from '@angular/material/slider';

interface SliderProps extends FormlyFieldProps {
  displayWith?: (value: number) => string;
  invert?: boolean;
  thumbLabel?: boolean;
  tickInterval?: number;
  valueText?: string;
  vertical?: boolean;
  //input?: (field: FormlyFieldConfig<SliderProps>, $event: MatSliderChange) => void;
  //change?: (field: FormlyFieldConfig<SliderProps>, $event: MatSliderChange) => void;
}

export interface FormlySliderFieldConfig extends FormlyFieldConfig<SliderProps> {
  type: 'slider' | Type<FormlyFieldSlider>;
}

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <!-- TODO: The 'invert' property no longer exists -->
    <!-- TODO: The 'tickInterval' property no longer exists -->
    <!-- TODO: The 'valueText' property no longer exists -->
    <!-- TODO: The 'vertical' property no longer exists -->
    <mat-slider
      *ngIf="formControl"
      [id]="id"
      [style.width]="'100%'"
      [tabIndex]="props.tabindex"
      [color]="props.color"
      [displayWith]="displayWith"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [discrete]="props.thumbLabel"
      #ngSlider
    >
      <input matSliderThumb [formControl]="formControl" [formlyAttributes]="field" #ngThumb />
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig<SliderProps>> {
  @ViewChild(MatSlider, { static: false }) slider!: MatSlider;
  @ViewChild(MatSliderThumb, { static: false }) matSliderThumb!: MatSliderThumb;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      thumbLabel: false,
      displayWith: (value: number) => String(value),
    },
  };

  displayWith(value: number) {
    if (this.props?.displayWith) {
      return this.props.displayWith(value);
    } else {
      return String(value);
    }
  }

  override onContainerClick(event: MouseEvent): void {
    this.matSliderThumb.focus();
    super.onContainerClick(event);
  }
}
