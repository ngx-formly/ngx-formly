import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  // eslint-disable-next-line
  selector: 'input[type=file]',
  host: {
    '(change)': 'onChange($any($event.target).files)',
    '(blur)': 'onTouched()',
  },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessor, multi: true }],
  standalone: true,
})
// https://github.com/angular/angular/issues/7341
export class FileValueAccessor implements ControlValueAccessor {
  onChange = (_: FileList | null) => {};
  onTouched = () => {};

  writeValue(_value: FileList | null) {}
  registerOnChange(fn: (files: FileList | null) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
