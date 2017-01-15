import { Directive, HostListener, ElementRef, Input, Renderer, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { SingleFocusDispatcher } from '../services/formly.single.focus.dispatcher';
import { FormlyFieldConfig } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
  providers: [SingleFocusDispatcher],
})
export class FormlyAttributes implements OnInit, OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;
  @Input() formControl;
  private attributes = ['id', 'name', 'placeholder', 'tabindex', 'step', 'aria-describedby'];
  private statements = ['change', 'keydown', 'keyup', 'keypress', 'click', 'focus', 'blur'];

  @HostListener('focus') onFocus() {
    if (!this.field.focus) {
      this.focusDispatcher.notify(this.field.key);
    }
  }

  constructor(
    private renderer: Renderer,
    private elementRef: ElementRef,
    private focusDispatcher: SingleFocusDispatcher,
  ) {}

  ngOnInit() {
    this.focusDispatcher.listen((key: String) =>
      this.field.focus = this.field.key === key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['field']) {
      this.attributes
        .filter(attr => this.canApplyRender(changes['field'], attr))
        .map(attr => this.renderer.setElementAttribute(
          this.elementRef.nativeElement, attr, this.getPropValue(this.field, attr),
        ));

      this.statements
        .filter(statement => this.canApplyRender(changes['field'], statement))
        .map(statement => this.renderer.listen(
          this.elementRef.nativeElement, statement, this.getStatementValue(statement),
        ));

      if (this.field.focus || (changes['field'].previousValue.focus !== undefined && changes['field'].previousValue.focus !== this.field.focus)) {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, this.field.focus ? 'focus' : 'blur', []);
        if (this.field.focus) {
          // TODO: Raise a Event which can be used for streaming
          this.focusDispatcher.notify(this.field.key);
        }
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

    return field[prop];
  }

  private getStatementValue(statement: string) {
    const fn = this.field.templateOptions[statement];

    return () => fn(this.field, this.formControl);
  }

  private canApplyRender(fieldChange: SimpleChange, prop): Boolean {
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
