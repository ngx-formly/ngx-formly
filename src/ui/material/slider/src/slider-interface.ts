/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { InjectionToken } from '@angular/core';
import { RippleGlobalOptions } from '@angular/material/core';

/**
 * Thumb types: range slider has two thumbs (START, END) whereas single point
 * slider only has one thumb (END).
 */
export const enum _MatThumb {
  START = 1,
  END = 2,
}

/**
 * Injection token that can be used to query for a `MatSliderThumb`.
 * Used primarily to avoid circular imports.
 * @docs-private
 */
export const MAT_SLIDER_THUMB = new InjectionToken<{}>('_MatSliderThumb');

/** Represents a drag event emitted by the MatSlider component. */
export interface MatSliderDragEvent {
  /** The MatSliderThumb that was interacted with. */
  source: _MatSliderThumb;

  /** The MatSlider that was interacted with. */
  parent: _MatSlider;

  /** The current value of the slider. */
  value: number;
}

export interface _MatSlider {
  /** Gets the slider thumb input of the given thumb position. */
  _getInput(thumbPosition: _MatThumb): _MatSliderThumb | undefined;

  /** The minimum value that the slider can have. */
  min: number;

  /** The maximum value that the slider can have. */
  max: number;

  /** The amount that slider values can increment or decrement by. */
  step: number;

  /** Whether the slider is disabled. */
  disabled: boolean;

  /** Whether the slider is a range slider. */
  _isRange: boolean;

  /** Whether the slider is rtl. */
  _isRtl: boolean;

  /** The stored width of the host element's bounding client rect. */
  _cachedWidth: number;

  /** The stored width of the host element's bounding client rect. */
  _cachedLeft: number;

  /**
   * The padding of the native slider input. This is added in order to make the region where the
   * thumb ripple extends past the end of the slider track clickable.
   */
  _inputPadding: number;

  /**
   * The offset represents left most translateX of the slider knob. Inversely,
   * (slider width - offset) = the right most translateX of the slider knob.
   *
   * Note:
   *    * The native slider knob differs from the visual slider. It's knob cannot slide past
   *      the end of the track AT ALL.
   *    * The visual slider knob CAN slide past the end of the track slightly. It's knob can slide
   *      past the end of the track such that it's center lines up with the end of the track.
   */
  _inputOffset: number;

  /** The radius of the visual slider's ripple. */
  _rippleRadius: number;

  /** The global configuration for `matRipple` instances. */
  readonly _globalRippleOptions?: RippleGlobalOptions;

  /** Whether animations have been disabled. */
  _noopAnimations: boolean;

  /** Whether or not the slider should use animations. */
  _hasAnimation: boolean;

  /** Triggers UI updates that are needed after a slider input value has changed. */
  _onValueChange: (source: _MatSliderThumb) => void;

  /** Triggers UI updates that are needed after the slider thumb position has changed. */
  _onTranslateXChange: (source: _MatSliderThumb) => void;

  /** Updates the stored slider dimensions using the current bounding client rect. */
  _updateDimensions: () => void;

  /** Used to set the transition duration for thumb and track animations. */
  _setTransition: (withAnimation: boolean) => void;
}

export interface _MatSliderThumb {
  /** The minimum value that the slider can have. */
  min: number;

  /** The maximum value that the slider can have. */
  max: number;

  /** The amount that slider values can increment or decrement by. */
  step: number;

  /** The current value of this slider input. */
  value: number;

  /** The current translateX in px of the slider visual thumb. */
  translateX: number;

  /** Indicates whether this thumb is the start or end thumb. */
  thumbPosition: _MatThumb;

  /** Similar to percentage but calcualted using translateX relative to the total track width. */
  fillPercentage: number;

  /** Whether the slider is disabled. */
  disabled: boolean;

  /** The host native HTML input element. */
  _hostElement: HTMLInputElement;

  /** Whether the input is currently focused (either by tab or after clicking). */
  _isFocused: boolean;

  /** The aria-valuetext string representation of the input's value. */
  _valuetext: string;

  /**
   * Indicates whether UI updates should be skipped.
   *
   * This flag is used to avoid flickering
   * when correcting values on pointer up/down.
   */
  _skipUIUpdate: boolean;

  /** Handles the initialization of properties for the slider input. */
  initProps: () => void;

  /** Handles UI initialization controlled by this slider input. */
  initUI: () => void;

  /** Calculates the visual thumb's translateX based on the slider input's current value. */
  _calcTranslateXByValue: () => number;

  /** Updates the visual thumb based on the slider input's current value. */
  _updateThumbUIByValue: () => void;

  /**
   * Sets the slider input to disproportionate dimensions to allow for touch
   * events to be captured on touch devices.
   */
  _updateWidthInactive: () => void;

  /**
   * Used to set the slider width to the correct
   * dimensions while the user is dragging.
   */
  _updateWidthActive: () => void;
}
