import { Component, ChangeDetectionStrategy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';

interface SliderProps extends FormlyFieldProps {
  displayWith?: (value: number) => string;
  discrete?: boolean;
  showTickMarks?: boolean;

  input?: (field: FormlyFieldConfig<SliderProps>, $event: Event) => void;
  change?: (field: FormlyFieldConfig<SliderProps>, $event: Event) => void;
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
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [color]="props.color"
      [displayWith]="props.displayWith"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [discrete]="props.discrete"
      [showTickMarks]="props.showTickMarks"
      [step]="props.step"
      (input)="props.input && props.input(field, $event)"
      (change)="props.change && props.change(field, $event)"
    >
      <input matSliderThumb [formControl]="formControl" [formlyAttributes]="field" />
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSlider extends FieldType<FieldTypeConfig<SliderProps>> {
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      displayWith: (value: number) => `${value}`,
    },
  };
}
