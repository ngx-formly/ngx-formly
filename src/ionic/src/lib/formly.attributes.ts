import { Directive, Input } from '@angular/core';
import { FormlyAttributes, FormlyFieldConfig } from '@ngx-formly/core';

@Directive({
  // tslint:disable-next-line
  selector: '[ionFormlyAttributes]',
  host: {
    '(keyup)': 'to.keyup && to.keyup(field, $event)',
    '(keydown)': 'to.keydown && to.keydown(field, $event)',
    '(click)': 'to.click && to.click(field, $event)',
    '(keypress)': 'to.keypress && to.keypress(field, $event)',

    '(ionChange)': 'to.change && to.change(field, $event)',
    '(ionFocus)': 'onFocus($event)',
    '(ionBlur)': 'onBlur($event)',
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
