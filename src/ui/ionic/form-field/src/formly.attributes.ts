import { Directive, Input } from '@angular/core';
import { ɵFormlyAttributes as FormlyAttributes, FormlyFieldConfig } from '@ngx-formly/core';

@Directive({
  // eslint-disable-next-line
  selector: '[ionFormlyAttributes]',
  host: {
    '(ionFocus)': 'onFocus($event)',
    '(ionBlur)': 'onBlur($event)',
    '(ionChange)': 'onChange($event)',
  },
})
export class IonFormlyAttributes extends FormlyAttributes {
  @Input('ionFormlyAttributes') field: FormlyFieldConfig;

  focusElement(element, value: boolean) {
    if (!element.setFocus || !value) {
      return;
    }

    if (!element.getInputElement()) {
      setTimeout(() => element.setFocus(), 300);
    } else {
      element.setFocus();
    }
  }
}
