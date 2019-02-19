import { Directive, HostListener, ElementRef, Input, OnChanges, SimpleChanges, Renderer2, DoCheck, Inject, OnDestroy } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from './formly.field.config';
import { wrapProperty, defineHiddenProp } from '../utils';
import { DOCUMENT } from '@angular/platform-browser';

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
export class FormlyAttributes implements OnChanges, DoCheck, OnDestroy {
  @Input('formlyAttributes') field: FormlyFieldConfig;

  private placeholder?: string;
  private tabindex?: number;
  private readonly?: boolean;
  private document: Document;

  @HostListener('focus', ['$event']) onFocus($event) {
    if (!this.field.focus) {
      this.field.focus = true;
    }

    if (this.to.focus) {
      this.to.focus(this.field, $event);
    }
  }

  @HostListener('blur', ['$event']) onBlur($event) {
    if (this.field.focus) {
      this.field.focus = false;
    }

    if (this.to.blur) {
      this.to.blur(this.field, $event);
    }
  }
  get to(): FormlyTemplateOptions {
    return this.field.templateOptions || {};
  }

  private get fieldAttrElements() { return this.field['_attrElements'] || []; }
  private set fieldAttrElements(elements: any[]) {
    defineHiddenProp(this.field, '_attrElements', elements);
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) _document: any,
  ) {
    this.document = _document;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'id', this.field.id);
      if (this.to && this.to.attributes) {
        wrapProperty(this.to, 'attributes', (newVal, oldValue) => {
          if (oldValue) {
            Object.keys(oldValue).forEach(attr => this.renderer.removeAttribute(this.elementRef.nativeElement, attr));
          }

          if (newVal) {
            Object.keys(newVal).forEach(attr => this.setAttribute(attr, newVal[attr]));
          }
        });
      }

      this.attachAttrElement();
      if (this.fieldAttrElements.length === 1) {
        wrapProperty(this.field, 'focus', (value) => {
          const element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
          if (!element || !element.focus) {
            return;
          }

          const isFocused = !!this.document.activeElement
            && this.fieldAttrElements
              .some(element => this.document.activeElement === element || element.contains(this.document.activeElement));

          if (value && !isFocused) {
            element.focus();
          } else if (!value && isFocused) {
            element.blur();
          }
        });
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
      this.setAttribute('placeholder', this.to.placeholder);
      this.placeholder = this.to.placeholder;
    }

    if (this.tabindex !== this.to.tabindex) {
      this.setAttribute('tabindex', `${this.to.tabindex || 0}`);
      this.tabindex = this.to.tabindex;
    }

    if (this.readonly !== this.to.readonly) {
      this.setAttribute('readonly', `${this.to.readonly}`);
      this.readonly = this.to.readonly;
    }
  }

  ngOnDestroy() {
    this.detachAttrElement();
  }

  private attachAttrElement() {
    this.fieldAttrElements = [...this.fieldAttrElements, this.elementRef.nativeElement];
  }

  private detachAttrElement() {
    this.fieldAttrElements = this.fieldAttrElements.filter(element => element !== this.elementRef.nativeElement);
  }

  private setAttribute(attr: string, value: string) {
    this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
  }
}
