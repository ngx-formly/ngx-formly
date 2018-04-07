import { Directive, HostListener, ElementRef, Input, OnChanges, SimpleChanges, SimpleChange, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
})
export class FormlyAttributes implements OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;
  @Input() formControl: AbstractControl;
  private attributes = ['id', 'name', 'placeholder', 'tabindex', 'step', 'readonly'];
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

      if (this.field.templateOptions && this.field.templateOptions.attributes) {
        const attributes = this.field.templateOptions.attributes;
        Object.keys(attributes).forEach(name => this.renderer.setAttribute(
          this.elementRef.nativeElement, name, attributes[name] as string,
        ));
      }

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
    if (field.templateOptions && field.templateOptions[prop]) {
      return field.templateOptions[prop];
    }

    return (<any>field)[prop] || '';
  }

  private getStatementValue(statement: string) {
    const fn = this.field.templateOptions[statement];
    if (fn.length === 2) {
      console.warn(`FormlyForm: field(${this.field.key}) Passing formControl as a second argument for "${statement}" is deprecated and it will be removed in the 3.0 version, use "field.formControl" instead`);
    }

    return (event: any) => fn.length !== 2 ? fn(this.field, event) : fn(this.field, this.formControl);
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
