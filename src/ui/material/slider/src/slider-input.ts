/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Subject } from 'rxjs';
import { _MatThumb, MatSliderDragEvent, _MatSlider, _MatSliderThumb, MAT_SLIDER_THUMB } from './slider-interface';

/**
 * Provider that allows the slider thumb to register as a ControlValueAccessor.
 * @docs-private
 */
export const MAT_SLIDER_THUMB_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatSliderThumb),
  multi: true,
};

/**
 * Directive that adds slider-specific behaviors to an input element inside `<mat-slider>`.
 * Up to two may be placed inside of a `<mat-slider>`.
 *
 * If one is used, the selector `matSliderThumb` must be used, and the outcome will be a normal
 * slider. If two are used, the selectors `matSliderStartThumb` and `matSliderEndThumb` must be
 * used, and the outcome will be a range slider with two slider thumbs.
 * @ignore
 */
@Directive({
  // eslint-disable-next-line
  selector: 'input[matSliderThumb]',
  exportAs: 'matSliderThumb',
  host: {
    class: 'mdc-slider__input',
    type: 'range',
    '[attr.aria-valuetext]': '_valuetext',
    '(change)': '_onChange()',
    '(input)': '_onInput()',
    // TODO(wagnermaciel): Consider using a global event listener instead.
    // Reason: I have found a semi-consistent way to mouse up without triggering this event.
    '(blur)': '_onBlur()',
    '(focus)': '_onFocus()',
  },
  providers: [MAT_SLIDER_THUMB_VALUE_ACCESSOR, { provide: MAT_SLIDER_THUMB, useExisting: MatSliderThumb }],
})
export class MatSliderThumb implements _MatSliderThumb, OnDestroy, ControlValueAccessor {
  @Input()
  get value(): number {
    return coerceNumberProperty(this._hostElement.value);
  }
  set value(v: NumberInput) {
    const val = coerceNumberProperty(v).toString();
    if (!this._hasSetInitialValue) {
      this._initialValue = val;
      return;
    }
    if (this._isActive) {
      return;
    }
    this._hostElement.value = val;
    this._updateThumbUIByValue();
    this._slider._onValueChange(this);
    this._cdr.detectChanges();
  }
  /** Event emitted when the `value` is changed. */
  @Output() readonly valueChange: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted when the slider thumb starts being dragged. */
  @Output() readonly dragStart: EventEmitter<MatSliderDragEvent> = new EventEmitter<MatSliderDragEvent>();

  /** Event emitted when the slider thumb stops being dragged. */
  @Output() readonly dragEnd: EventEmitter<MatSliderDragEvent> = new EventEmitter<MatSliderDragEvent>();

  /**
   * The current translateX in px of the slider visual thumb.
   * @docs-private
   */
  get translateX(): number {
    if (this._slider.min >= this._slider.max) {
      this._translateX = 0;
      return this._translateX;
    }
    if (this._translateX === undefined) {
      this._translateX = this._calcTranslateXByValue();
    }
    return this._translateX;
  }
  set translateX(v: number) {
    this._translateX = v;
  }
  private _translateX: number | undefined;

  /**
   * Indicates whether this thumb is the start or end thumb.
   * @docs-private
   */
  thumbPosition: _MatThumb = _MatThumb.END;

  /** @docs-private */
  get min(): number {
    return coerceNumberProperty(this._hostElement.min);
  }
  set min(v: NumberInput) {
    this._hostElement.min = coerceNumberProperty(v).toString();
    this._cdr.detectChanges();
  }

  /** @docs-private */
  get max(): number {
    return coerceNumberProperty(this._hostElement.max);
  }
  set max(v: NumberInput) {
    this._hostElement.max = coerceNumberProperty(v).toString();
    this._cdr.detectChanges();
  }

  get step(): number {
    return coerceNumberProperty(this._hostElement.step);
  }
  set step(v: NumberInput) {
    this._hostElement.step = coerceNumberProperty(v).toString();
    this._cdr.detectChanges();
  }

  /** @docs-private */
  get disabled(): boolean {
    return coerceBooleanProperty(this._hostElement.disabled);
  }
  set disabled(v: BooleanInput) {
    this._hostElement.disabled = coerceBooleanProperty(v);
    this._cdr.detectChanges();

    if (this._slider.disabled !== this.disabled) {
      this._slider.disabled = this.disabled;
    }
  }

  /** The percentage of the slider that coincides with the value. */
  get percentage(): number {
    if (this._slider.min >= this._slider.max) {
      return this._slider._isRtl ? 1 : 0;
    }
    return (this.value - this._slider.min) / (this._slider.max - this._slider.min);
  }

  /** @docs-private */
  get fillPercentage(): number {
    if (!this._slider._cachedWidth) {
      return this._slider._isRtl ? 1 : 0;
    }
    if (this._translateX === 0) {
      return 0;
    }
    return this.translateX / this._slider._cachedWidth;
  }

  /** The host native HTML input element. */
  _hostElement: HTMLInputElement;

  /** The aria-valuetext string representation of the input's value. */
  _valuetext: string;

  /** The radius of a native html slider's knob. */
  _knobRadius: number = 8;

  /** Whether user's cursor is currently in a mouse down state on the input. */
  _isActive: boolean = false;

  /** Whether the input is currently focused (either by tab or after clicking). */
  _isFocused: boolean = false;

  /** Used to relay updates to _isFocused to the slider visual thumbs. */
  private _setIsFocused(v: boolean): void {
    this._isFocused = v;
  }

  /**
   * Whether the initial value has been set.
   * This exists because the initial value cannot be immediately set because the min and max
   * must first be relayed from the parent MatSlider component, which can only happen later
   * in the component lifecycle.
   */
  private _hasSetInitialValue: boolean = false;

  /** The stored initial value. */
  _initialValue: string | undefined;

  /** Defined when a user is using a form control to manage slider value & validation. */
  private _formControl: FormControl | undefined;

  /** Emits when the component is destroyed. */
  protected readonly _destroyed = new Subject<void>();

  /**
   * Indicates whether UI updates should be skipped.
   *
   * This flag is used to avoid flickering
   * when correcting values on pointer up/down.
   */
  _skipUIUpdate: boolean = false;

  /** Callback called when the slider input value changes. */
  private _onChangeFn: (value: any) => void = () => {};

  /** Callback called when the slider input has been touched. */
  private _onTouchedFn: () => void = () => {};

  constructor(
    readonly _ngZone: NgZone,
    readonly _elementRef: ElementRef<HTMLInputElement>,
    readonly _cdr: ChangeDetectorRef,
    @Inject(MatSlider) protected _slider: _MatSlider,
  ) {
    this._hostElement = _elementRef.nativeElement;
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._ngZone.runOutsideAngular(() => {
      this._hostElement.addEventListener('pointerdown', this._onPointerDown);
      this._hostElement.addEventListener('pointermove', this._onPointerMove);
      this._hostElement.addEventListener('pointerup', this._onPointerUp);
    });
  }

  ngOnDestroy(): void {
    this._hostElement.removeEventListener('pointerdown', this._onPointerDown);
    this._hostElement.removeEventListener('pointermove', this._onPointerMove);
    this._hostElement.removeEventListener('pointerup', this._onPointerUp);
    this._destroyed.next();
    this._destroyed.complete();
    this.dragStart.complete();
    this.dragEnd.complete();
  }

  /** @docs-private */
  initProps(): void {
    this._updateWidthInactive();

    // If this or the parent slider is disabled, just make everything disabled.
    if (this.disabled !== this._slider.disabled) {
      // The MatSlider setter for disabled will relay this and disable both inputs.
      this._slider.disabled = true;
    }

    this.step = this._slider.step;
    this.min = this._slider.min;
    this.max = this._slider.max;
    this._initValue();
  }

  /** @docs-private */
  initUI(): void {
    this._updateThumbUIByValue();
  }

  _initValue(): void {
    this._hasSetInitialValue = true;
    if (this._initialValue === undefined) {
      this.value = this._getDefaultValue();
    } else {
      this._hostElement.value = this._initialValue;
      this._updateThumbUIByValue();
      this._slider._onValueChange(this);
      this._cdr.detectChanges();
    }
  }

  _getDefaultValue(): number {
    return this.min;
  }

  _onBlur(): void {
    this._setIsFocused(false);
    this._onTouchedFn();
  }

  _onFocus(): void {
    this._setIsFocused(true);
  }

  _onChange(): void {
    this.valueChange.emit(this.value);
    // only used to handle the edge case where user
    // mousedown on the slider then uses arrow keys.
    if (this._isActive) {
      this._updateThumbUIByValue({ withAnimation: true });
    }
  }

  _onInput(): void {
    this._onChangeFn(this.value);
    // handles arrowing and updating the value when
    // a step is defined.
    if (this._slider.step || !this._isActive) {
      this._updateThumbUIByValue({ withAnimation: true });
    }
    this._slider._onValueChange(this);
  }

  _onNgControlValueChange(): void {
    // only used to handle when the value change
    // originates outside of the slider.
    if (!this._isActive || !this._isFocused) {
      this._slider._onValueChange(this);
      this._updateThumbUIByValue();
    }
    this._slider.disabled = this._formControl!.disabled;
  }

  _onPointerDown(event: PointerEvent): void {
    if (this.disabled || event.button !== 0) {
      return;
    }

    this._isActive = true;
    this._setIsFocused(true);
    this._updateWidthActive();
    this._slider._updateDimensions();

    // Does nothing if a step is defined because we
    // want the value to snap to the values on input.
    if (!this._slider.step) {
      this._updateThumbUIByPointerEvent(event, { withAnimation: true });
    }

    if (!this.disabled) {
      this._handleValueCorrection(event);
      this.dragStart.emit({ source: this, parent: this._slider, value: this.value });
    }
  }

  /**
   * Corrects the value of the slider on pointer up/down.
   *
   * Called on pointer down and up because the value is set based
   * on the inactive width instead of the active width.
   */
  private _handleValueCorrection(event: PointerEvent): void {
    // Don't update the UI with the current value! The value on pointerdown
    // and pointerup is calculated in the split second before the input(s)
    // resize. See _updateWidthInactive() and _updateWidthActive() for more
    // details.
    this._skipUIUpdate = true;

    // Note that this function gets triggered before the actual value of the
    // slider is updated. This means if we were to set the value here, it
    // would immediately be overwritten. Using setTimeout ensures the setting
    // of the value happens after the value has been updated by the
    // pointerdown event.
    setTimeout(() => {
      this._skipUIUpdate = false;
      this._fixValue(event);
    }, 0);
  }

  /** Corrects the value of the slider based on the pointer event's position. */
  _fixValue(event: PointerEvent): void {
    const xPos = event.clientX - this._slider._cachedLeft;
    const width = this._slider._cachedWidth;
    const step = this._slider.step === 0 ? 1 : this._slider.step;
    const numSteps = Math.floor((this._slider.max - this._slider.min) / step);
    const percentage = this._slider._isRtl ? 1 - xPos / width : xPos / width;

    // To ensure the percentage is rounded to the necessary number of decimals.
    const fixedPercentage = Math.round(percentage * numSteps) / numSteps;

    const impreciseValue = fixedPercentage * (this._slider.max - this._slider.min) + this._slider.min;
    const value = Math.round(impreciseValue / step) * step;
    const prevValue = this.value;

    if (value === prevValue) {
      // Because we prevented UI updates, if it turns out that the race
      // condition didn't happen and the value is already correct, we
      // have to apply the ui updates now.
      this._slider._onValueChange(this);
      this._slider.step > 0
        ? this._updateThumbUIByValue()
        : this._updateThumbUIByPointerEvent(event, { withAnimation: this._slider._hasAnimation });
      return;
    }

    this.value = value;
    this.valueChange.emit(this.value);
    this._onChangeFn(this.value);
    this._slider._onValueChange(this);
    this._slider.step > 0
      ? this._updateThumbUIByValue()
      : this._updateThumbUIByPointerEvent(event, { withAnimation: this._slider._hasAnimation });
  }

  _onPointerMove(event: PointerEvent): void {
    // Again, does nothing if a step is defined because
    // we want the value to snap to the values on input.
    if (!this._slider.step && this._isActive) {
      this._updateThumbUIByPointerEvent(event);
    }
  }

  _onPointerUp(): void {
    if (this._isActive) {
      this._isActive = false;
      this.dragEnd.emit({ source: this, parent: this._slider, value: this.value });
      setTimeout(() => this._updateWidthInactive());
    }
  }

  _clamp(v: number): number {
    return Math.max(Math.min(v, this._slider._cachedWidth), 0);
  }

  _calcTranslateXByValue(): number {
    if (this._slider._isRtl) {
      return (1 - this.percentage) * this._slider._cachedWidth;
    }
    return this.percentage * this._slider._cachedWidth;
  }

  _calcTranslateXByPointerEvent(event: PointerEvent): number {
    return event.clientX - this._slider._cachedLeft;
  }

  /**
   * Used to set the slider width to the correct
   * dimensions while the user is dragging.
   */
  _updateWidthActive(): void {
    this._hostElement.style.padding = `0 ${this._slider._inputPadding}px`;
    this._hostElement.style.width = `calc(100% + ${this._slider._inputPadding}px)`;
  }

  /**
   * Sets the slider input to disproportionate dimensions to allow for touch
   * events to be captured on touch devices.
   */
  _updateWidthInactive(): void {
    this._hostElement.style.padding = '0px';
    this._hostElement.style.width = 'calc(100% + 48px)';
    this._hostElement.style.left = '-24px';
  }

  _updateThumbUIByValue(options?: { withAnimation: boolean }): void {
    this.translateX = this._clamp(this._calcTranslateXByValue());
    this._updateThumbUI(options);
  }

  _updateThumbUIByPointerEvent(event: PointerEvent, options?: { withAnimation: boolean }): void {
    this.translateX = this._clamp(this._calcTranslateXByPointerEvent(event));
    this._updateThumbUI(options);
  }

  _updateThumbUI(options?: { withAnimation: boolean }) {
    this._slider._setTransition(!!options?.withAnimation);
    this._slider._onTranslateXChange(this);
  }

  /**
   * Sets the input's value.
   * @param value The new value of the input
   * @docs-private
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Registers a callback to be invoked when the input's value changes from user input.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnChange(fn: any): void {
    this._onChangeFn = fn;
  }

  /**
   * Registers a callback to be invoked when the input is blurred by the user.
   * @param fn The callback to register
   * @docs-private
   */
  registerOnTouched(fn: any): void {
    this._onTouchedFn = fn;
  }

  /**
   * Sets the disabled state of the slider.
   * @param isDisabled The new disabled state
   * @docs-private
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus(): void {
    this._hostElement.focus();
  }

  blur(): void {
    this._hostElement.blur();
  }
}
