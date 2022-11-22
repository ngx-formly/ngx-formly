import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, Renderer2 } from '@angular/core';
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
  constructor(renderer: Renderer2, elementRef: ElementRef, @Inject(DOCUMENT) _document: any) {
    super(renderer, elementRef, _document);
  }
}
