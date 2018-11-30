import { Directive, Input } from '@angular/core';
import { FormlyAttributes, FormlyFieldConfig } from '@ngx-formly/core';

@Directive({
  selector: '[formlyMatAttributes]',
  host: {
    '[attr.name]': 'field.name',
    '[attr.step]': 'to.step',

    '(keyup)': 'to.keyup && to.keyup(field, $event)',
    '(keydown)': 'to.keydown && to.keydown(field, $event)',
    '(click)': 'to.click && to.click(field, $event)',
    '(change)': 'to.change && to.change(field, $event)',
    '(keypress)': 'to.keypress && to.keypress(field, $event)',
  },
})
export class FormlyMatAttributes extends FormlyAttributes {
  @Input('formlyMatAttributes') field: FormlyFieldConfig;
}
