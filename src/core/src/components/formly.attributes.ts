import { Directive, HostListener, ElementRef, Input, OnChanges, SimpleChanges, SimpleChange, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
})
export class FormlyAttributes implements OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;
  @Input() formControl: AbstractControl;
  private attributes = ['id', 'name', 'placeholder', 'tabindex', 'step', 'aria-describedby'];
  private statements = ['change', 'keydown', 'keyup', 'keypress', 'click', 'focus', 'blur'];

  @HostListener('focus') onFocus() {
    this.field.focus = true;
  }

  @HostListener('blur') onBlur() {
    this.field.focus = false;
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      const fieldChanges = changes.field;
      this.attributes
        .filter(attr => this.canApplyRender(fieldChanges, attr))
        .forEach(attr => this.renderer.setAttribute(
          this.elementRef.nativeElement, attr, this.getPropValue(this.field, attr),
        ));

      this.statements
        .filter(statement => this.canApplyRender(fieldChanges, statement))
        .forEach(statement => this.renderer.listen(
          this.elementRef.nativeElement, statement, this.getStatementValue(statement),
        ));

      if ((fieldChanges.previousValue || {}).focus !== (fieldChanges.currentValue || {}).focus && this.elementRef.nativeElement.focus) {
        this.elementRef.nativeElement[this.field.focus ? 'focus' : 'blur']();
      }
    }
  }

  private getPropValue(field: FormlyFieldConfig, prop: string) {
    field = field || {};
    if (field.id && prop === 'aria-describedby') {
      return field.id + '-message';
    }

    if (field.templateOptions && field.templateOptions[prop]) {
      return field.templateOptions[prop];
    }

    return (<any>field)[prop] || '';
  }

  private getStatementValue(statement: string) {
    const fn = this.field.templateOptions[statement];

    return () => fn(this.field, this.formControl);
  }

  private canApplyRender(fieldChange: SimpleChange, prop: string): Boolean {
    const currentValue = this.getPropValue(this.field, prop),
      previousValue = this.getPropValue(fieldChange.previousValue, prop);

    if (previousValue !== currentValue) {
      if (this.statements.indexOf(prop) !== -1) {
        return typeof currentValue === 'function';
      }

      return true;
    }

    return false;
  }
}
