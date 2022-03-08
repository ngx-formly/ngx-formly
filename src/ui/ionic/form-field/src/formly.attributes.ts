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
  @Input('ionFormlyAttributes') override field: FormlyFieldConfig;
}
