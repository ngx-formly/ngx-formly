import { Directive, HostListener, ElementRef, Input, Renderer, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SingleFocusDispatcher } from '../services/formly.single.focus.dispatcher';
import { FormlyFieldConfig } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
  providers: [SingleFocusDispatcher],
})
export class FormlyAttributes implements OnInit, OnChanges {
  @Input('formlyAttributes') field: FormlyFieldConfig;

  private attributes = ['placeholder', 'tabindex', 'step'];

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
      this.field.templateOptions.focus = this.field.key === key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['field']) {
      const previousOptions = changes['field'].previousValue.templateOptions || {},
        templateOptions = this.field.templateOptions;

      this.attributes
        .filter(attribute => templateOptions[attribute] !== '' || templateOptions[attribute] !== undefined)
        .map(attribute => {
          if (previousOptions[attribute] !== templateOptions[attribute]) {
            this.renderer.setElementAttribute(this.elementRef.nativeElement, attribute, templateOptions[attribute]);
          }
        });

      if (templateOptions.focus || (previousOptions.focus !== undefined && previousOptions.focus !== templateOptions.focus)) {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, templateOptions.focus ? 'focus' : 'blur', []);
        if (templateOptions.focus) {
          // TODO: Raise a Event which can be used for streaming
          this.focusDispatcher.notify(this.field.key);
        }
      }
    }
  }
}
