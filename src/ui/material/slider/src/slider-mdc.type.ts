import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { MAT_SLIDER_THUMB, _MatSlider, _MatSliderThumb } from './slider-interface';
import { FormlyFieldSlider } from './slider.type';

@Component({
  selector: 'formly-field-mat-slider',
  template: `
    <mat-slider
      [id]="id"
      [style.width]="'100%'"
      [formlyAttributes]="field"
      [tabIndex]="props.tabindex"
      [color]="props.color"
      [displayWith]="displayWith"
      [invert]="props.invert"
      [max]="props.max"
      [min]="props.min"
      [step]="props.step"
      [discrete]="props.thumbLabel || props.discrete"
      [showTickMarks]="props.showTickMarks"
      [step]="props.step"
      [tickInterval]="props.tickInterval"
      [valueText]="props.valueText"
      [vertical]="props.vertical"
      (input)="props.input && props.input(field, $event)"
      (change)="props.change && props.change(field, $event)"
    >
      <input matSliderThumb [formControl]="formControl" [formlyAttributes]="field" />
    </mat-slider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldMDCSlider extends FormlyFieldSlider {
  @ViewChild(MAT_SLIDER_THUMB, { static: true }) sliderThumb: _MatSliderThumb;
  @ViewChild(MatSlider, { static: true }) set mdcSlider(slider: _MatSlider) {
    Object.defineProperty(slider, '_input', {
      set: () => {},
      get: () => this.sliderThumb,
    });

    const visualThumb = {
      _hostElement: {
        classList: {
          add: () => {},
          remove: () => {},
        },
      },
    };

    // workarround for "ERROR TypeError: visualThumb is undefined" when `discrete` is set to `true`
    (slider as any)._thumbs = { first: visualThumb, last: visualThumb };
  }

  override onContainerClick(event: MouseEvent): void {
    this.sliderThumb?._hostElement.focus();
    super.onContainerClick(event);
  }
}
