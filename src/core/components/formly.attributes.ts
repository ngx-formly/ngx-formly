import { Directive, HostListener, ElementRef, Input, Renderer } from '@angular/core';
import { SingleFocusDispatcher } from '../services/formly.single.focus.dispatcher';
import { FormlyTemplateOptions } from './formly.field.config';

@Directive({
  selector: '[formlyAttributes]',
  providers: [SingleFocusDispatcher],
})
export class FormlyAttributes {
  _focus: boolean;
  @Input() formControlName;
  private attributes = ['placeholder', 'tabindex', 'step'];
  @Input('formlyAttributes') set templateOptions(val: FormlyTemplateOptions) {
    if (!this._focus && val.focus) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
      // TODO: Raise a Event which can be used for streaming
      this.focusDispatcher.notify(this.formControlName);
    }
    if (this._focus && !val.focus) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'blur', []);
    }
    this._focus = val.focus;
    this.attributes.filter(attribute => val[attribute] !== '' || val[attribute] !== undefined)
      .map(attribute => this.renderer.setElementAttribute(this.elementRef.nativeElement, attribute, val[attribute]));
  };

  @HostListener('focus') onFocus() {
    if (!this._focus) {
      this.focusDispatcher.notify(this.formControlName);
      this._focus = true;
    }
  }

  constructor(private renderer: Renderer, private elementRef: ElementRef, private focusDispatcher: SingleFocusDispatcher) {
    focusDispatcher.listen((key: String) => {
      if (this.formControlName !== key) {
        this.templateOptions.focus = false;
      }
    });
  }
}
