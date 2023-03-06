import { Component, ChangeDetectionStrategy, ViewChild, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { MatSlider, MatSliderChange } from '@angular/material/slider';

interface SliderProps extends FormlyFieldProps {
  displayWith?: (value: number) => string | number;
  invert?: boolean;
  tickInterval?: number;
  valueText?: string;
  vertical?: boolean;
  input?: (field: FormlyFieldConfig<SliderProps>, $event: MatSliderChange) => void;
  change?: (field: FormlyFieldConfig<SliderProps>, $event: MatSliderChange) => void;

  /** @deprecated Use `discrete` instead. */
  thumbLabel?: boolean;
  discrete?: boolean;
  showTickMarks?: boolean;
}

export interface FormlySliderFieldConfig extends FormlyFieldConfig<SliderProps> {
  type: 'slider' | Type<FormlyFieldSlider>;
}

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider
      [id]="id"
      [style.width]="'100%'"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [color]="props.color"
      [displayWith]="props.displayWith"
      [invert]="props.invert"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [thumbLabel]="props.thumbLabel || props.discrete"
      [tickInterval]="props.tickInterval"
      [valueText]="props.valueText"
      [vertical]="props.vertical"
      (input)="props.input && props.input(field, $event)"
      (change)="props.change && props.change(field, $event)"
    >
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig<SliderProps>> {
  @ViewChild(MatSlider, { static: true }) slider!: MatSlider;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      thumbLabel: false,
      displayWith: (value: number) => value,
    },
  };

  override onContainerClick(event: MouseEvent): void {
    this.slider.focus?.();
    super.onContainerClick(event);
  }
}
