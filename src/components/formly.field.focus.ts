import { Directive, HostListener, ElementRef, Input, Renderer } from '@angular/core';
import { SingleFocusDispatcher } from '../services/formly.single.focus.dispatcher';

@Directive({
  selector: '[formlyNgFocus]',
  providers: [SingleFocusDispatcher],
})
export class FormlyNgFocus {
  _focus: boolean;

  @Input() formControlName;
  @Input('formlyNgFocus')
  set focus(val: boolean) {
    if (!this._focus && val) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
      // TODO: Raise a Event which can be used for streaming
      this.focusDispatcher.notify(this.formControlName);
    }

    if (this._focus && !val) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'blur', []);
    }

    this._focus = val;
  }

  @HostListener('focus') onFocus() {
    if (!this._focus) {
      this.focusDispatcher.notify(this.formControlName);
      this._focus = true;
    }
  }

  constructor(private renderer: Renderer, private elementRef: ElementRef, private focusDispatcher: SingleFocusDispatcher) {
    focusDispatcher.listen((key: String) => {
      if (this.formControlName !== key) {
        this.focus = false;
      }
    });
  }
}
