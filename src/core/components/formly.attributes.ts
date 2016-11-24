import { Directive, HostListener, ElementRef, Input, Renderer, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SingleFocusDispatcher } from '../services/formly.single.focus.dispatcher';
import { FormlyFieldConfig } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
  providers: [SingleFocusDispatcher],
})
export class FormlyAttributes implements OnInit, OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;
  @Input() formControl;
  private attributes = ['placeholder', 'tabindex', 'step', 'aria-describedby'];
  private statements = ['change', 'keydown', 'keyup', 'keypress', 'click', 'focus', 'blur'];

  @HostListener('focus') onFocus() {
    if (!this.field.focus) {
      this.focusDispatcher.notify(this.field.key);
    }
  }

  constructor(
    private renderer: Renderer,
    private elementRef: ElementRef,
    private focusDispatcher: SingleFocusDispatcher
  ) {}

  ngOnInit() {
    this.focusDispatcher.listen((key: String) =>
      this.field.focus = this.field.key === key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['field']) {
      const previousOptions = changes['field'].previousValue.templateOptions || {},
        templateOptions = this.field.templateOptions;

      this.attributes
        .filter(attribute => templateOptions[attribute] !== '' || templateOptions[attribute] !== undefined)
        .map(attribute => {
          if (attribute === 'aria-describedby') {
            this.renderer.setElementAttribute(this.elementRef.nativeElement, attribute, this.field.id + '-message');
          } else if (previousOptions[attribute] !== templateOptions[attribute]) {
            this.renderer.setElementAttribute(this.elementRef.nativeElement, attribute, templateOptions[attribute]);
          }
        });
      this.statements
        .filter(statement => {
          if (previousOptions[statement] !== templateOptions[statement]) {
            if (typeof templateOptions[statement] === 'function') {
              this.renderer.listen(this.elementRef.nativeElement, statement, () => {
                templateOptions[statement](this.field, this.formControl);
              });
            }
          }
        });

      if (this.field.focus || (changes['field'].previousValue.focus !== undefined && changes['field'].previousValue.focus !== this.field.focus)) {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, this.field.focus ? 'focus' : 'blur', []);
        if (this.field.focus) {
          // TODO: Raise a Event which can be used for streaming
          this.focusDispatcher.notify(this.field.key);
        }
      }
    }
  }
}
