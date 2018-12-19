import { Directive, HostListener, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, DoCheck } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
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
export class FormlyAttributes implements OnChanges, DoCheck {
  @Input('formlyAttributes') field: FormlyFieldConfig;

  private placeholder?: string;
  private tabindex?: number;
  private readonly?: boolean;

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
        this.setAttributes(this.to.attributes);
        Object.defineProperty(this.to, 'attributes', {
          get: () => this.to.__attributes__,
          set: attributes => this.setAttributes(attributes),
          enumerable: true,
          configurable: true,
        });
      }

      if ((fieldChanges.previousValue || {}).focus !== (fieldChanges.currentValue || {}).focus && this.elementRef.nativeElement.focus) {
        this.elementRef.nativeElement[this.field.focus ? 'focus' : 'blur']();
      }
    }
  }

  /**
   * We need to re-evaluate all the attributes on every change detection cycle, because
   * by using a HostBinding we run into certain edge cases. This means that whatever logic
   * is in here has to be super lean or we risk seriously damaging or destroying the performance.
   *
   * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
   * Material issue: https://github.com/angular/material2/issues/14024
   */
  ngDoCheck() {
    if (this.placeholder !== this.to.placeholder) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', this.to.placeholder);
      this.placeholder = this.to.placeholder;
    }

    if (this.tabindex !== this.to.tabindex) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'tabindex', `${this.to.tabindex || 0}`);
      this.tabindex = this.to.tabindex;
    }

    if (this.readonly !== this.to.readonly) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'readonly', `${this.to.readonly}`);
      this.readonly = this.to.readonly;
    }
  }

  private setAttributes(attributes) {
    if (this.to.__attributes__ && this.to.__attributes__ !== attributes) {
      Object.keys(this.to.__attributes__).forEach(name => this.renderer.removeAttribute(this.elementRef.nativeElement, name));
    }

    this.to.__attributes__ = attributes;
    Object.keys(attributes).forEach(name => this.renderer.setAttribute(
      this.elementRef.nativeElement, name, attributes[name] as string,
    ));
  }
}
