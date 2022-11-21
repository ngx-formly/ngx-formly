import { Component, ChangeDetectionStrategy, ViewChild, Type, ElementRef } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { MatSlider } from '@angular/material/slider';

interface SliderProps extends FormlyFieldProps {
  displayWith?: (value: number) => string | number;
  invert?: boolean;
  thumbLabel?: boolean;
  tickInterval?: number;
  valueText?: string;
  vertical?: boolean;
  input?: (field: FormlyFieldConfig<SliderProps>, $event: any) => void;
  change?: (field: FormlyFieldConfig<SliderProps>, $event: any) => void;
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
      [displayWith]="displayWith"
      [invert]="props.invert"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [thumbLabel]="props.thumbLabel"
      [discrete]="props.thumbLabel"
      [tickInterval]="props.tickInterval"
      [valueText]="props.valueText"
      [vertical]="props.vertical"
      (input)="props.input && props.input(field, $event)"
      (change)="props.change && props.change(field, $event)"
    >
      <input #sliderThumb matSliderThumb [formControl]="formControl" [formlyAttributes]="field" />
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig<SliderProps>> {
  @ViewChild(MatSlider, { static: true }) slider: MatSlider;
  @ViewChild('sliderThumb', { static: false }) sliderThumb: ElementRef<HTMLInputElement>;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      thumbLabel: false,
    },
  };

  override onContainerClick(event: MouseEvent): void {
    this.slider?.focus();
    this.sliderThumb?.nativeElement.focus();
    super.onContainerClick(event);
  }

  displayWith(value: number) {
    if (this.props?.displayWith) {
      return String(this.props.displayWith(value));
    } else {
      return String(value);
    }
  }
}
