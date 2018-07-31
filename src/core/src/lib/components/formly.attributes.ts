import { Directive, HostListener, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
  host: {
    '[attr.name]': 'field.name',
    '[attr.placeholder]': 'to.placeholder',
    '[attr.tabindex]': 'to.tabindex',
    '[attr.readonly]': 'to.readonly',
    '[attr.step]': 'to.step',

    '(keyup)': 'to.keyup && to.keyup(field, $event)',
    '(keydown)': 'to.keydown && to.keydown(field, $event)',
    '(click)': 'to.click && to.click(field, $event)',
    '(change)': 'to.change && to.change(field, $event)',
    '(keypress)': 'to.keypress && to.keypress(field, $event)',
  },
})
export class FormlyAttributes implements OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;

  @HostListener('focus', ['$event']) onFocus($event) {
    this.field.focus = true;
    if (this.to.focus) {
      this.to.focus(this.field, $event);
    }
  }

  @HostListener('blur', ['$event']) onBlur($event) {
    this.field.focus = false;
    if (this.to.blur) {
      this.to.blur(this.field, $event);
    }
  }

  get to(): FormlyTemplateOptions {
    return this.field.templateOptions || {};
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      const fieldChanges = changes.field;

      this.renderer.setAttribute(this.elementRef.nativeElement, 'id', this.field.id);
      if (this.to && this.to.attributes) {
        const attributes = this.to.attributes;
        Object.keys(attributes).forEach(name => this.renderer.setAttribute(
          this.elementRef.nativeElement, name, attributes[name] as string,
        ));
      }

      if ((fieldChanges.previousValue || {}).focus !== (fieldChanges.currentValue || {}).focus && this.elementRef.nativeElement.focus) {
        this.elementRef.nativeElement[this.field.focus ? 'focus' : 'blur']();
      }
    }
  }
}
